import { PrismaClient } from '@prisma/client';

// Reused across warm serverless invocations via the module cache — a fresh
// PrismaClient per request would exhaust Neon's connection limit quickly.
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.__prisma || new PrismaClient();

if (!globalForPrisma.__prisma) {
  globalForPrisma.__prisma = prisma;
}
