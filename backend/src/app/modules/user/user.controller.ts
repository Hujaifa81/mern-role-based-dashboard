import { NextFunction, Request, Response } from 'express';
import { catchAsync, sendResponse } from '../../utils';
import httpStatus from 'http-status-codes';
import { IJwtPayload } from '../../interfaces';
import { UserService } from './user.service';
import { logActivity } from '../../utils/activityLogger';
import { ActivityType } from '../activityLog/activityLog.interface';

const createUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const decodedToken = req.user as IJwtPayload;
    const user = await UserService.createUser(req.body);

    // Log user creation activity
    await logActivity(
      decodedToken.userId,
      ActivityType.USER_CREATED,
      `Admin created user: ${user.email}`,
      req,
      user._id.toString(),
      { email: user.email, role: user.role }
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'User Created Successfully',
      data: user,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.params.id;
    const decodedToken = req.user;
    const payload = req.body;
    const user = await UserService.updateUser(
      userId,
      payload,
      decodedToken as IJwtPayload
    );

    // Determine activity type based on what was updated
    let activityType = ActivityType.USER_UPDATED;
    let description = 'User profile updated';

    if (payload.role) {
      activityType = ActivityType.ROLE_CHANGED;
      description = `User role changed to ${payload.role}`;
    } else if (payload.status === 'SUSPENDED') {
      activityType = ActivityType.USER_SUSPENDED;
      description = 'User account suspended';
    } else if (payload.status === 'ACTIVE') {
      activityType = ActivityType.USER_ACTIVATED;
      description = 'User account activated';
    } else if (payload.isVerified) {
      activityType = ActivityType.EMAIL_VERIFIED;
      description = 'Email verified by admin';
    }

    // Log the activity
    await logActivity(
      (decodedToken as IJwtPayload).userId,
      activityType,
      description,
      req,
      userId,
      payload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User Updated Successfully',
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const query = req.query;
    const result = await UserService.getAllUsers(
      query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'All Users Retrieved Successfully',
      data: result.data,
      meta: result.meta,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const decodedToken = req.user as IJwtPayload;
    const result = await UserService.getMe(decodedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Your profile Retrieved Successfully',
      data: result.data,
    });
  }
);

const getSingleUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id;
    const result = await UserService.getSingleUser(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User Retrieved Successfully',
      data: result.data,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe,
};
