import { PrismaClient } from '@prisma/client';
import { config } from './env';

// Prevent multiple instances of Prisma Client in development mode
declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: config.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (config.nodeEnv !== 'production') {
  globalThis.prismaGlobal = prisma;
}
