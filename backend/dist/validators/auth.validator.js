"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.changePasswordSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email('Please provide a valid email address'),
        password: zod_1.z
            .string({ required_error: 'Password is required' })
            .min(8, 'Password must be at least 8 characters long')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        firstName: zod_1.z
            .string({ required_error: 'First name is required' })
            .min(2, 'First name must be at least 2 characters'),
        lastName: zod_1.z
            .string({ required_error: 'Last name is required' })
            .min(2, 'Last name must be at least 2 characters'),
        role: zod_1.z
            .nativeEnum(client_1.Role, { errorMap: () => ({ message: 'Role must be either CUSTOMER or ADMIN' }) })
            .optional()
            .default(client_1.Role.CUSTOMER),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email('Please provide a valid email address'),
        password: zod_1.z
            .string({ required_error: 'Password is required' }),
    }),
});
exports.refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().optional(),
    }).optional(),
});
exports.changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string({ required_error: 'Current password is required' }),
        newPassword: zod_1.z
            .string({ required_error: 'New password is required' })
            .min(8, 'Password must be at least 8 characters long')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
    }),
});
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string({ required_error: 'First name is required' }).min(2),
        lastName: zod_1.z.string({ required_error: 'Last name is required' }).min(2),
    }),
});
