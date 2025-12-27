import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { AnalyticsRoutes } from '../modules/analytics/analytics.routes';
import { ActivityLogRoutes } from '../modules/activityLog/activityLog.routes';

export const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/analytics',
    route: AnalyticsRoutes,
  },
  {
    path: '/activity-logs',
    route: ActivityLogRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
