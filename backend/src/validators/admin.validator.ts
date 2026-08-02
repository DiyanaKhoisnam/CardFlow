import { z } from 'zod';
import { CardStatus } from '@prisma/client';

export const updateUserStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID format'),
  }),
  body: z.object({
    isSuspended: z.boolean({ required_error: 'isSuspended boolean flag is required' }),
  }),
});

export const updateAdminCardStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid card ID format'),
  }),
  body: z.object({
    status: z.nativeEnum(CardStatus, {
      errorMap: () => ({ message: 'Status must be ACTIVE, FROZEN, or BLOCKED' }),
    }),
  }),
});

export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>['body'];
