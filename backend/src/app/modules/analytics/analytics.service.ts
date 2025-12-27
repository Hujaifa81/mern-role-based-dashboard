import { User } from '../user/user.model';
import { Status } from '../user/user.interface';

const getUserStats = async () => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ status: Status.ACTIVE });
  const suspendedUsers = await User.countDocuments({
    status: Status.SUSPENDED,
  });
  const verifiedUsers = await User.countDocuments({ isVerified: true });
  const unverifiedUsers = await User.countDocuments({ isVerified: false });

  return {
    totalUsers,
    activeUsers,
    suspendedUsers,
    verifiedUsers,
    unverifiedUsers,
  };
};

const getRoleDistribution = async () => {
  const roleDistribution = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        role: '$_id',
        count: 1,
      },
    },
  ]);

  return roleDistribution;
};

const getRegistrationTrends = async (days: number = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const trends = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
        '_id.day': 1,
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day',
          },
        },
        count: 1,
      },
    },
  ]);

  return trends;
};

const getNewUsersThisMonth = async () => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const newUsers = await User.countDocuments({
    createdAt: { $gte: startOfMonth },
  });

  // Previous month for comparison
  const startOfPreviousMonth = new Date(startOfMonth);
  startOfPreviousMonth.setMonth(startOfPreviousMonth.getMonth() - 1);

  const previousMonthUsers = await User.countDocuments({
    createdAt: {
      $gte: startOfPreviousMonth,
      $lt: startOfMonth,
    },
  });

  const percentageChange =
    previousMonthUsers > 0
      ? ((newUsers - previousMonthUsers) / previousMonthUsers) * 100
      : 100;

  return {
    currentMonth: newUsers,
    previousMonth: previousMonthUsers,
    percentageChange: Math.round(percentageChange * 100) / 100,
  };
};

const getStatusDistribution = async () => {
  const statusDistribution = await User.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: '$_id',
        count: 1,
      },
    },
  ]);

  return statusDistribution;
};

const getRecentUsers = async (limit: number = 5) => {
  const recentUsers = await User.find()
    .select('name email role status isVerified createdAt')
    .sort({ createdAt: -1 })
    .limit(limit);

  return recentUsers;
};

const getDashboardOverview = async () => {
  const [
    userStats,
    roleDistribution,
    statusDistribution,
    newUsersThisMonth,
    recentUsers,
    registrationTrends,
  ] = await Promise.all([
    getUserStats(),
    getRoleDistribution(),
    getStatusDistribution(),
    getNewUsersThisMonth(),
    getRecentUsers(),
    getRegistrationTrends(30),
  ]);

  return {
    userStats,
    roleDistribution,
    statusDistribution,
    newUsersThisMonth,
    recentUsers,
    registrationTrends,
  };
};

export const AnalyticsService = {
  getUserStats,
  getRoleDistribution,
  getRegistrationTrends,
  getNewUsersThisMonth,
  getStatusDistribution,
  getRecentUsers,
  getDashboardOverview,
};
