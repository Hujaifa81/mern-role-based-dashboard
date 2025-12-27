export enum ActivityType {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_REGISTER = 'USER_REGISTER',
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_SUSPENDED = 'USER_SUSPENDED',
  USER_ACTIVATED = 'USER_ACTIVATED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  PROFILE_UPDATED = 'PROFILE_UPDATED',
}

export interface IActivityLog {
  user: string;
  activityType: ActivityType;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  targetUser?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
}
