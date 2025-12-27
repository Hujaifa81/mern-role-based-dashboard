import { Schema, model } from 'mongoose';
import { ActivityType, IActivityLog } from './activityLog.interface';

const activityLogSchema = new Schema<IActivityLog>(
  {
    user: {
      type: String,
      required: true,
      ref: 'User',
    },
    activityType: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    targetUser: {
      type: String,
      ref: 'User',
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ activityType: 1, createdAt: -1 });
activityLogSchema.index({ targetUser: 1, createdAt: -1 });

export const ActivityLog = model<IActivityLog>(
  'ActivityLog',
  activityLogSchema
);
