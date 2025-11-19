import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/infra/app.module';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import request from 'supertest';

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
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    });
    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'jhondoe@gmail.com',
      },
    });
    expect(userOnDatabase).toBeTruthy();
  });
});
