import { Router } from 'express';
import { ActivityLogController } from './activityLog.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';

const router = Router();

// Admin only routes
router.get(
  '/',
  checkAuth(Role.ADMIN),
  ActivityLogController.getAllActivityLogs
);

router.get(
  '/recent',
  checkAuth(Role.ADMIN),
  ActivityLogController.getRecentActivityLogs
);

router.get(
  '/type/:type',
  checkAuth(Role.ADMIN),
  ActivityLogController.getActivityLogsByType
);

router.get(
  '/user/:userId',
  checkAuth(Role.ADMIN),
  ActivityLogController.getUserActivityLogs
);

router.delete(
  '/cleanup',
  checkAuth(Role.ADMIN),
  ActivityLogController.deleteOldActivityLogs
);

// User can view their own activity logs
router.get(
  '/my-activity',
  checkAuth(Role.USER, Role.ADMIN),
  ActivityLogController.getMyActivityLogs
);

export const ActivityLogRoutes = router;
