import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ActivityLogService } from './activityLog.service';
import { ActivityType } from './activityLog.interface';
import { catchAsync, sendResponse } from '../../utils';
import { IJwtPayload } from '../../interfaces';

const getAllActivityLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await ActivityLogService.getAllActivityLogs(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Activity logs retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getMyActivityLogs = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as IJwtPayload).userId;
  const result = await ActivityLogService.getUserActivityLogs(
    userId,
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Your activity logs retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getUserActivityLogs = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await ActivityLogService.getUserActivityLogs(
    userId,
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User activity logs retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getActivityLogsByType = catchAsync(
  async (req: Request, res: Response) => {
    const { type } = req.params;
    const result = await ActivityLogService.getActivityLogsByType(
      type as ActivityType,
      req.query as Record<string, string>
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `${type} activity logs retrieved successfully`,
      data: result.data,
      meta: result.meta,
    });
  }
);

const getRecentActivityLogs = catchAsync(
  async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const result = await ActivityLogService.getRecentActivityLogs(limit);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Recent activity logs retrieved successfully',
      data: result,
    });
  }
);

const deleteOldActivityLogs = catchAsync(
  async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 90;
    const result = await ActivityLogService.deleteOldActivityLogs(days);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: `Activity logs older than ${days} days deleted successfully`,
      data: result,
    });
  }
);

export const ActivityLogController = {
  getAllActivityLogs,
  getMyActivityLogs,
  getUserActivityLogs,
  getActivityLogsByType,
  getRecentActivityLogs,
  deleteOldActivityLogs,
};
