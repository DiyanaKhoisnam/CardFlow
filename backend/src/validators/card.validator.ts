import { z } from 'zod';
import { CardStatus } from '@prisma/client';

export const updateCardStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid card ID format'),
  }),
  body: z.object({
    status: z.nativeEnum(CardStatus, {
      errorMap: () => ({ message: 'Status must be ACTIVE, FROZEN, or BLOCKED' }),
    }),
  }),
});

export type UpdateCardStatusInput = z.infer<typeof updateCardStatusSchema>['body'];
