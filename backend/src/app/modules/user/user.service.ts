import { AppError } from '../../errorHelpers.ts';
import { IJwtPayload } from '../../interfaces';
import { hashedPassword } from '../../utils/bcryptHelper';
import { QueryBuilder } from '../../utils/queryBuilder';
import { userSearchableFields } from './user.constants';
import { IAuthProvider, IUser, Role } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status-codes';

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, 'User already exists');
  }

  const afterPasswordHashed = await hashedPassword(password as string);

  const authProvider: IAuthProvider = {
    provider: 'credentials',
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: afterPasswordHashed,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: IJwtPayload
) => {
  if (decodedToken.role === Role.USER) {
    if (userId !== decodedToken.userId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not authorized to update another user'
      );
    }
  }

  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  /**
   * email - cannot update
   * name, phone - can update
   * password - needs re-hashing (use changePassword service)
   * only admin can update: role, status, isVerified
   */

  // Prevent email update
  if (payload.email) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email cannot be updated');
  }

  // Prevent password update through this endpoint
  if (payload.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Use changePassword endpoint to update password'
    );
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not authorized to change role'
      );
    }
  }

  if (payload.status || payload.isVerified) {
    if (decodedToken.role === Role.USER) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not authorized to update status or verification'
      );
    }
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const usersData = queryBuilder
    .filter()
    .search(userSearchableFields)
    .sort()
    .dateRange('createdAt')
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    usersData.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return {
    data: user,
  };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return {
    data: user,
  };
};

export const UserService = {
  createUser,
  updateUser,
  getAllUsers,
  getSingleUser,
  getMe,
};
