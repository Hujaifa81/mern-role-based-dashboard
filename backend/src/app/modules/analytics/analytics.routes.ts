import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = Router();

// Admin only routes
router.get(
  '/dashboard-overview',
  checkAuth(Role.ADMIN),
  AnalyticsController.getDashboardOverview
);

router.get(
  '/user-stats',
  checkAuth(Role.ADMIN),
  AnalyticsController.getUserStats
);

router.get(
  '/role-distribution',
  checkAuth(Role.ADMIN),
  AnalyticsController.getRoleDistribution
);

router.get(
  '/registration-trends',
  checkAuth(Role.ADMIN),
  AnalyticsController.getRegistrationTrends
);

router.get(
  '/new-users-month',
  checkAuth(Role.ADMIN),
  AnalyticsController.getNewUsersThisMonth
);

router.get(
  '/status-distribution',
  checkAuth(Role.ADMIN),
  AnalyticsController.getStatusDistribution
);

router.get(
  '/recent-users',
  checkAuth(Role.ADMIN),
  AnalyticsController.getRecentUsers
);

export const AnalyticsRoutes = router;
