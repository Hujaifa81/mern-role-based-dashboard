import { z } from 'zod';

// Password schema with all validation rules
const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(128, { message: 'Password cannot exceed 128 characters' })
  .regex(/^(?=.*[a-z])/, {
    message: 'Password must contain at least 1 lowercase letter',
  })
  .regex(/^(?=.*[A-Z])/, {
    message: 'Password must contain at least 1 uppercase letter',
  })
  .regex(/^(?=.*\d)/, {
    message: 'Password must contain at least 1 number',
  })
  .regex(/^(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least 1 special character',
  });

// Login validation schema
export const loginValidationZodSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address format' })
    .toLowerCase(),
  password: z.string().min(1, { message: 'Password is required' }),
});

// Register validation schema
export const registerValidationZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address format' })
    .toLowerCase(),
  password: passwordSchema,
  confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// OTP verification schema
export const otpVerificationZodSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
});


// Change Password validation schema
export const changePasswordValidationZodSchema = z
  .object({
    oldPassword: z.string().min(1, { message: 'Old password is required' }),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'New password must be different from old password',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });





// Forgot password validation schema
export const forgotPasswordValidationZodSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address format' })
    .toLowerCase(),
});

// Reset password validation schema
export const resetPasswordValidationZodSchema = z.object({
  token: z.string().min(1, { message: 'Token is required' }),
  userId: z.string().min(1, { message: 'User ID is required' }),
  newPassword: passwordSchema,
});

// Type exports for TypeScript
export type LoginFormData = z.infer<typeof loginValidationZodSchema>;
export type RegisterFormData = z.infer<typeof registerValidationZodSchema>;
export type OTPVerificationFormData = z.infer<typeof otpVerificationZodSchema>;
export type ChangePasswordFormData = z.infer<
  typeof changePasswordValidationZodSchema
>;
export type ForgotPasswordFormData = z.infer<
  typeof forgotPasswordValidationZodSchema
>;
export type ResetPasswordFormData = z.infer<
  typeof resetPasswordValidationZodSchema
>;
