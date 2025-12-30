import { Router } from 'express';
import { UserController } from './user.controller';
import { Role } from './user.interface';
import { checkAuth, validateRequest } from '../../middlewares';
import { createUserZodSchema, updateUserZodSchema } from './user.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(createUserZodSchema),
  UserController.createUser
);
router.get('/all-users', checkAuth(Role.ADMIN), UserController.getAllUsers);
router.get('/me', checkAuth(...Object.values(Role)), UserController.getMe);
router.get('/:id', checkAuth(Role.ADMIN), UserController.getSingleUser);
import { multerUpload } from '../../config';

router.patch(
  '/:id',
  multerUpload.single('picture'),
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserController.updateUser
);

export const UserRoutes = router;
