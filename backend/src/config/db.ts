import { PrismaClient } from '../generated/prisma';
import { PrismaNeonHttp } from '@prisma/adapter-neon';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, { fullResults: false });

export const prisma = globalForPrisma.prisma || new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });

if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
