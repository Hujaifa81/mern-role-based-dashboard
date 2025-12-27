import { NextFunction, Request, Response } from 'express';
import {
  catchAsync,
  createUserToken,
  sendResponse,
  setCookie,
} from '../../utils';
import httpStatus from 'http-status-codes';
import { envVars } from '../../config';
import { AppError } from '../../errorHelpers.ts';
import { AuthService } from './auth.service';
import { IJwtPayload } from '../../interfaces';
import passport from 'passport';
import { logActivity } from '../../utils/activityLogger';
import { ActivityType } from '../activityLog/activityLog.interface';

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      'local',
      async (err: Error | null, user: any, info: { message?: string }) => {
        if (err) {
          return next(
            new AppError(
              httpStatus.UNAUTHORIZED,
              err.message || 'Authentication failed'
            )
          );
        }

        if (!user) {
          return next(
            new AppError(
              httpStatus.UNAUTHORIZED,
              info?.message || 'Authentication failed'
            )
          );
        }

        const userTokens = await createUserToken(user);

        const { password: _pass, ...rest } = user.toObject();

        setCookie(res, userTokens);

        await logActivity(
          user._id.toString(),
          ActivityType.USER_LOGIN,
          `User ${user.email} logged in successfully`,
          req
        );

        sendResponse(res, {
          success: true,
          statusCode: httpStatus.OK,
          message: 'User Logged In Successfully',
          data: {
            accessToken: userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            user: rest,
          },
        });
      }
    )(req, res, next);
  }
);

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : '';

    if (redirectTo.startsWith('/')) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication failed');
    }

    const tokenInfo = createUserToken(user);

    setCookie(res, tokenInfo);

    // Log login activity
    await logActivity(
      (user as any)._id.toString(),
      ActivityType.USER_LOGIN,
      `User logged in via Google OAuth`,
      req
    );

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'No refresh token received from cookies'
      );
    }
    const tokenInfo = await AuthService.getNewAccessToken(
      refreshToken as string
    );

    setCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'New Access Token Retrieved Successfully',
      data: tokenInfo,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user as IJwtPayload;

    await AuthService.changePassword(
      oldPassword,
      newPassword,
      decodedToken as IJwtPayload
    );

    await logActivity(
      decodedToken!.userId,
      ActivityType.PASSWORD_CHANGED,
      'User changed their password',
      req
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Password Changed Successfully',
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { token, newPassword, userId } = req.body;

    await AuthService.resetPassword(token, newPassword, userId);

    // Log password reset activity
    await logActivity(
      userId,
      ActivityType.PASSWORD_RESET,
      'User reset their password via email',
      req
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Password Changed Successfully',
      data: null,
    });
  }
);

const forgotPassword = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email } = req.body;

    await AuthService.forgotPassword(email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Email Sent Successfully',
      data: null,
    });
  }
);

const setPassword = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const decodedToken = req.user as IJwtPayload;
    const { password } = req.body;

    await AuthService.setPassword(decodedToken.userId, password);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Password Set Successfully',
      data: null,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req.user as IJwtPayload)?.userId;

    const cookieOptions = {
      httpOnly: true,
      secure: envVars.NODE_ENV === 'production',
      sameSite: envVars.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    } as const;

    // Clear access token
    res.clearCookie('accessToken', cookieOptions);

    // Clear refresh token
    res.clearCookie('refreshToken', cookieOptions);

    // Clear session cookie if it exists
    res.clearCookie('connect.sid', cookieOptions);

    // Destroy express session
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
        }
      });
    }

    // Logout from passport
    if (req.logout) {
      req.logout((err) => {
        if (err) {
          console.error('Passport logout error:', err);
        }
      });
    }

    // Log logout activity
    if (userId) {
      await logActivity(
        userId,
        ActivityType.USER_LOGOUT,
        'User logged out',
        req
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Logout successful',
      data: null,
    });
  }
);

export const AuthController = {
  credentialsLogin,
  googleCallbackController,
  getNewAccessToken,
  changePassword,
  resetPassword,
  forgotPassword,
  setPassword,
  logout,
};
