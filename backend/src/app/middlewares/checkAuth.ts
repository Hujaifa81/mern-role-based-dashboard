import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { User } from '../modules/user/user.model';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../errorHelpers.ts';
import { envVars } from '../config';
import { IJwtPayload } from '../interfaces';
import { Status } from '../modules/user/user.interface';

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization || req.cookies.accessToken;

      if (!accessToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'No Token Received');
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as IJwtPayload;

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User does not exist');
      }
      if (!isUserExist.isVerified) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User is not verified');
      }
      if (isUserExist.status === Status.SUSPENDED) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          `User is ${isUserExist.status}`
        );
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          'You are not permitted to view this route!!!'
        );
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log('jwt error', error);
      next(error);
    }
  };
