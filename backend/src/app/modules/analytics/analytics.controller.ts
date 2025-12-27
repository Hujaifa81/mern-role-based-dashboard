import { Request, Response } from 'express';
import { catchAsync, sendResponse } from '../../utils';
import httpStatus from 'http-status-codes';
import { AnalyticsService } from './analytics.service';

const getDashboardOverview = catchAsync(async (req: Request, res: Response) => {
  const data = await AnalyticsService.getDashboardOverview();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Dashboard overview retrieved successfully',
    data,
  });
});

const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const data = await AnalyticsService.getUserStats();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User statistics retrieved successfully',
    data,
  });
});

const getRoleDistribution = catchAsync(async (req: Request, res: Response) => {
  const data = await AnalyticsService.getRoleDistribution();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Role distribution retrieved successfully',
    data,
  });
});

const getRegistrationTrends = catchAsync(
  async (req: Request, res: Response) => {
    const days = req.query.days ? Number(req.query.days) : 30;
    const data = await AnalyticsService.getRegistrationTrends(days);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Registration trends retrieved successfully',
      data,
    });
  }
);

const getNewUsersThisMonth = catchAsync(async (req: Request, res: Response) => {
  const data = await AnalyticsService.getNewUsersThisMonth();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'New users this month retrieved successfully',
    data,
  });
});

const getStatusDistribution = catchAsync(
  async (req: Request, res: Response) => {
    const data = await AnalyticsService.getStatusDistribution();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Status distribution retrieved successfully',
      data,
    });
  }
);

const getRecentUsers = catchAsync(async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 5;
  const data = await AnalyticsService.getRecentUsers(limit);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Recent users retrieved successfully',
    data,
  });
});

export const AnalyticsController = {
  getDashboardOverview,
  getUserStats,
  getRoleDistribution,
  getRegistrationTrends,
  getNewUsersThisMonth,
  getStatusDistribution,
  getRecentUsers,
};
