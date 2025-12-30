import { Request } from 'express';
import { ActivityLog } from './activityLog.model';
import { ActivityType, IActivityLog } from './activityLog.interface';
import { QueryBuilder } from '../../utils/queryBuilder';
import { searchableFields } from './activityLog.constants';

const createActivityLog = async (data: Partial<IActivityLog>) => {
  const activityLog = await ActivityLog.create(data);
  return activityLog;
};

const logActivity = async (
  userId: string,
  activityType: ActivityType,
  description: string,
  req?: Request,
  targetUserId?: string,
  metadata?: Record<string, unknown>
) => {
  const ipAddress = req?.ip || req?.socket.remoteAddress;
  const userAgent = req?.get('user-agent');

  await createActivityLog({
    user: userId,
    activityType,
    description,
    ipAddress,
    userAgent,
    targetUser: targetUserId,
    metadata,
  });
};

const getAllActivityLogs = async (query: Record<string, string>) => {
  const activityLogQuery = new QueryBuilder(
    ActivityLog.find()
      .populate('user', 'name email role')
      .populate('targetUser', 'name email'),
    query
  );

  const logsData = activityLogQuery
    .filter()
    .search(searchableFields)
    .sort()
    .dateRange('createdAt')
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    logsData.build(),
    activityLogQuery.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getUserActivityLogs = async (
  userId: string,
  query: Record<string, string>
) => {
  const activityLogQuery = new QueryBuilder(
    ActivityLog.find({ user: userId }).populate('targetUser', 'name email'),
    query
  );

  const logsData = activityLogQuery
    .filter()
    .search(searchableFields)
    .sort()
    .dateRange('createdAt')
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    logsData.build(),
    activityLogQuery.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getActivityLogsByType = async (
  activityType: ActivityType,
  query: Record<string, string>
) => {
  const activityLogQuery = new QueryBuilder(
    ActivityLog.find({ activityType })
      .populate('user', 'name email role')
      .populate('targetUser', 'name email'),
    query
  );

  const logsData = activityLogQuery
    .filter()
    .search(['description'])
    .sort()
    .dateRange('createdAt')
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    logsData.build(),
    activityLogQuery.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getRecentActivityLogs = async (limit: number = 5) => {
  const logs = await ActivityLog.find()
    .populate('user', 'name email role')
    .populate('targetUser', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit);

  return logs;
};

const deleteOldActivityLogs = async (daysOld: number = 90) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await ActivityLog.deleteMany({
    createdAt: { $lt: cutoffDate },
  });

  return {
    deletedCount: result.deletedCount,
  };
};

export const ActivityLogService = {
  createActivityLog,
  logActivity,
  getAllActivityLogs,
  getUserActivityLogs,
  getActivityLogsByType,
  getRecentActivityLogs,
  deleteOldActivityLogs,
};
