import 'dotenv/config';
import 'tsconfig-paths/register';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseUrl(schemaId);

  process.env.DATABASE_URL = databaseUrl;

  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
});

afterAll(async () => {
  if (!prisma) {
    return;
  }

  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
