"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCardStatusSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.updateCardStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid card ID format'),
    }),
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.CardStatus, {
            errorMap: () => ({ message: 'Status must be ACTIVE, FROZEN, or BLOCKED' }),
        }),
    }),
});
