import { NextFunction, Request, Response } from 'express';
import { catchAsync, createUserToken, setCookie } from '../../utils';
import httpStatus from 'http-status-codes';
import { envVars } from '../../config';
import { AppError } from '../../errorHelpers.ts';

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

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthController = {
  googleCallbackController,
};
