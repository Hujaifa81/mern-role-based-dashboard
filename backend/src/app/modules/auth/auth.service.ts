import { IJwtPayload } from '../../interfaces';
import {
  comparePassword,
  createNewAccessTokenWithRefreshToken,
  generateToken,
  hashedPassword,
  sendEmail,
  verifyToken,
} from '../../utils';
import { User } from '../user/user.model';
import { AppError } from '../../errorHelpers.ts';
import { envVars } from '../../config';
import httpStatus from 'http-status-codes';
import { IAuthProvider, Status } from '../user/user.interface';

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken =
    await createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: IJwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = await comparePassword(
    oldPassword,
    user!.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Old Password does not match');
  }

  user!.password = await hashedPassword(newPassword);

  await user!.save();
};

const resetPassword = async (
  token: string,
  newPassword: string,
  userId: string
) => {
  const decodedToken = verifyToken(
    token,
    envVars.RESET_PASS_TOKEN
  ) as IJwtPayload;

  if (decodedToken.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Token does not match user');
  }

  const isUserExist = await User.findById(decodedToken.userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const afterPasswordHashed = await hashedPassword(newPassword);

  isUserExist.password = afterPasswordHashed;

  await isUserExist.save();
};

const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  if (!isUserExist.isVerified) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is not verified');
  }
  if (isUserExist.status === Status.SUSPENDED) {
    throw new AppError(httpStatus.FORBIDDEN, `User is ${isUserExist.status}`);
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = generateToken(
    jwtPayload as IJwtPayload,
    envVars.RESET_PASS_TOKEN,
    '15m'
  );

  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?userId=${isUserExist._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExist.email,
    subject: 'Password Reset',
    templateName: 'forgetPassword',
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};

const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === 'google')
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have already set you password. Now you can change the password from your profile password update'
    );
  }

  const afterPasswordHashed = await hashedPassword(plainPassword);

  const credentialProvider: IAuthProvider = {
    provider: 'credentials',
    providerId: user.email,
  };

  const auths: IAuthProvider[] = [...user.auths, credentialProvider];

  user.password = afterPasswordHashed;

  user.auths = auths;

  await user.save();
};

export const AuthService = {
  getNewAccessToken,
  changePassword,
  resetPassword,
  forgotPassword,
  setPassword,
};
