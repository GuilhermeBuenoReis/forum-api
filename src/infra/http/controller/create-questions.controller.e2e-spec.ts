import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Create question (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  it(`/POST questions`, async () => {
    const uniqueTitle = `New Question ${randomUUID()}`;

    const user = await prisma.user.create({
      data: {
        name: 'Jhon Doe',
        email: `${randomUUID()}@example.com`,
        password: '123456',
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: uniqueTitle,
        content: 'Question Content',
      });
    expect(response.statusCode).toBe(201);

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: uniqueTitle,
      },
    });
    expect(questionOnDatabase).toBeTruthy();
  });
});
