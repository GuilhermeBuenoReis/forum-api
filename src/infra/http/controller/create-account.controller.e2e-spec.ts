import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Create account (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it(`/POST accounts`, async () => {
    const email = `${randomUUID()}@example.com`;

    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Jhon Doe',
      email,
      password: '123456',
    });
    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    expect(userOnDatabase).toBeTruthy();
  });
});
