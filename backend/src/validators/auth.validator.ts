import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please provide a valid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    firstName: z
      .string({ required_error: 'First name is required' })
      .min(2, 'First name must be at least 2 characters'),
    lastName: z
      .string({ required_error: 'Last name is required' })
      .min(2, 'Last name must be at least 2 characters'),
    role: z
      .nativeEnum(Role, { errorMap: () => ({ message: 'Role must be either CUSTOMER or ADMIN' }) })
      .optional()
      .default(Role.CUSTOMER),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please provide a valid email address'),
    password: z
      .string({ required_error: 'Password is required' }),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }).optional(),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string({ required_error: 'Current password is required' }),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'First name is required' }).min(2),
    lastName: z.string({ required_error: 'Last name is required' }).min(2),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
