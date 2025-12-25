import httpStatus from 'http-status-codes';
import { envVars } from '../config';
import { IUser, Status } from '../modules/user/user.interface';
import { generateToken, verifyToken } from './jwt';
import { AppError } from '../errorHelpers.ts';
import { User } from '../modules/user/user.model';

export const createUserToken = (user: Partial<IUser>) => {
  const payload = {
    userId: user._id!,
    email: user.email!,
    role: user.role!,
  };
  const accessToken = generateToken(
    payload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );
  const refreshToken = generateToken(
    payload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  );

  if (!verifiedRefreshToken) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }
  const userExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!userExist) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User does not exist');
  }

  if (userExist.isVerified === false) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User is not verified');
  }

  if (userExist.status !== Status.ACTIVE) {
    throw new AppError(httpStatus.UNAUTHORIZED, `User is ${userExist.status}`);
  }

  const JwtPayload = {
    userId: userExist._id!,
    email: userExist.email!,
    role: userExist.role!,
  };
  const newAccessToken = generateToken(
    JwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return newAccessToken;
};
