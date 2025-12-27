import passport from 'passport';
import { envVars } from '../../config';
import { NextFunction, Request, Response, Router } from 'express';
import { AuthController } from './auth.controller';
import { Role } from '../user/user.interface';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.credentialsLogin
);
router.post('/refresh-token', AuthController.getNewAccessToken);
router.post('/logout', AuthController.logout);
router.post(
  '/change-password',
  checkAuth(...Object.values(Role)),
  validateRequest(AuthValidation.changePasswordZodSchema),
  AuthController.changePassword
);
router.post(
  '/set-password',
  checkAuth(...Object.values(Role)),
  validateRequest(AuthValidation.setPasswordZodSchema),
  AuthController.setPassword
);
router.post(
  '/forgot-password',
  validateRequest(AuthValidation.forgotPasswordZodSchema),
  AuthController.forgotPassword
);
router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordZodSchema),
  AuthController.resetPassword
);
router.get(
  '/google',
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || '/';
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: redirect as string,
    })(req, res, next);
  }
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with our support team!`,
  }),
  AuthController.googleCallbackController
);

export const AuthRoutes = router;
