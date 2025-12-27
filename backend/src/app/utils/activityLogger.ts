import { Request } from 'express';
import { ActivityLogService } from '../modules/activityLog/activityLog.service';
import { ActivityType } from '../modules/activityLog/activityLog.interface';

export const logActivity = async (
  userId: string,
  activityType: ActivityType,
  description: string,
  req?: Request,
  targetUserId?: string,
  metadata?: Record<string, unknown>
) => {
  try {
    await ActivityLogService.logActivity(
      userId,
      activityType,
      description,
      req,
      targetUserId,
      metadata
    );
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
