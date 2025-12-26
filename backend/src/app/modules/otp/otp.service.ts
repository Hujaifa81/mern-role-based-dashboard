import { User } from '../user/user.model';
import httpStatus from 'http-status-codes';
import { AppError } from '../../errorHelpers.ts';
import { generateOtp, sendEmail } from '../../utils';
import { redisClient } from '../../config';

const OTP_EXPIRATION = 2 * 60; // 2 minutes in seconds

const sendOTP = async (email: string, name: string): Promise<void> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is already verified');
  }
  const otp = generateOtp();

  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: 'EX',
      value: OTP_EXPIRATION,
    },
  });

  await sendEmail({
    to: email,
    subject: 'Your OTP Code',
    templateName: 'otp',
    templateData: {
      name: name,
      otp: otp,
    },
  });
};

const verifyOTP = async (email: string, otp: string): Promise<void> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is already verified');
  }

  const redisKey = `otp:${email}`;

  const savedOtp = await redisClient.get(redisKey);

  if (!savedOtp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP has expired or is invalid');
  }

  if (savedOtp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del([redisKey]),
  ]);
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};
