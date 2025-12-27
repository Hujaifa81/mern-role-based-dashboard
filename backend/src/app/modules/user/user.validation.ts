import z from 'zod';
import { Role, Status } from './user.interface';

export const createUserZodSchema = z.object({
  body: z.object({
    name: z
      .string({ invalid_type_error: 'Name must be string' })
      .min(2, { message: 'Name must be at least 2 characters long.' })
      .max(50, { message: 'Name cannot exceed 50 characters.' }),
    email: z
      .string({ invalid_type_error: 'Email must be string' })
      .email({ message: 'Invalid email address format.' })
      .toLowerCase()
      .min(5, { message: 'Email must be at least 5 characters long.' })
      .max(100, { message: 'Email cannot exceed 100 characters.' }),
    password: z
      .string({ invalid_type_error: 'Password must be string' })
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
      }),
  }),
});

export const updateUserZodSchema = z.object({
  body: z
    .object({
      name: z
        .string({ invalid_type_error: 'Name must be string' })
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .max(50, { message: 'Name cannot exceed 50 characters.' })
        .optional(),
      role: z.nativeEnum(Role).optional(),
      status: z.nativeEnum(Status).optional(),
      isVerified: z
        .boolean({ invalid_type_error: 'isVerified must be true or false' })
        .optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update.',
    }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
