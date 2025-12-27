import { NextFunction, Request, Response } from 'express';
import { catchAsync, sendResponse } from '../../utils';
import httpStatus from 'http-status-codes';
import { IJwtPayload } from '../../interfaces';
import { UserService } from './user.service';

const createUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await UserService.createUser(req.body);

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
