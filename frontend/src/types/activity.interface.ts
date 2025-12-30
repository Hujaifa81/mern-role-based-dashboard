export type ActivityType =
  | "USER_LOGIN"
  | "USER_LOGOUT"
  | "PASSWORD_CHANGED"
  | "PASSWORD_RESET"
  | "EMAIL_VERIFIED"
  | "PROFILE_UPDATED"
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_SUSPENDED"
  | "USER_ACTIVATED"
  | "ROLE_CHANGED"
  | "ACCOUNT_DELETED"
  | "FAILED_LOGIN_ATTEMPT";

export interface IActivityLog {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  activityType: ActivityType;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  targetUser?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IActivityLogResponse {
  success: boolean;
  message: string;
  data: IActivityLog[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
