import z from 'zod';

const passwordSchema = z
  .string({ invalid_type_error: 'Password must be a string' })
  .min(8, { message: 'Password must be at least 8 characters long.' })
  .max(128, { message: 'Password cannot exceed 128 characters.' })
  .regex(/^(?=.*[a-z])/, {
    message: 'Password must contain at least 1 lowercase letter.',
  })
  .regex(/^(?=.*[A-Z])/, {
    message: 'Password must contain at least 1 uppercase letter.',
  })
  .regex(/^(?=.*\d)/, {
    message: 'Password must contain at least 1 number.',
  })
  .regex(/^(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least 1 special character.',
  });

export const loginZodSchema = z.object({
  email: z
    .string({ invalid_type_error: 'Email must be a string' })
    .email({ message: 'Invalid email address format.' })
    .toLowerCase(),
  password: z
    .string({ invalid_type_error: 'Password must be a string' })
    .min(1, { message: 'Password is required.' }),
});

export const changePasswordZodSchema = z
  .object({
    oldPassword: z
      .string({ invalid_type_error: 'Old password must be a string' })
      .min(1, { message: 'Old password is required.' }),
    newPassword: passwordSchema,
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'New password must be different from old password.',
    path: ['newPassword'],
  });

export const setPasswordZodSchema = z.object({
  password: passwordSchema,
});

export const forgotPasswordZodSchema = z.object({
  email: z
    .string({ invalid_type_error: 'Email must be a string' })
    .email({ message: 'Invalid email address format.' })
    .toLowerCase(),
});

export const resetPasswordZodSchema = z.object({
  token: z
    .string({ invalid_type_error: 'Token must be a string' })
    .min(1, { message: 'Token is required.' }),
  newPassword: passwordSchema,
  userId: z
    .string({ invalid_type_error: 'User ID must be a string' })
    .min(1, { message: 'User ID is required.' }),
});

export const AuthValidation = {
  loginZodSchema,
  changePasswordZodSchema,
  setPasswordZodSchema,
  forgotPasswordZodSchema,
  resetPasswordZodSchema,
};
