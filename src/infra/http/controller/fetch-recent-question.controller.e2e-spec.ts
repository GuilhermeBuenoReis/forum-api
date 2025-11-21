import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Fetch recent question (E2E)', () => {
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

  it(`/GET questions`, async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Jhon Doe',
        email: `${randomUUID()}@example.com`,
        password: '123456',
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    const slugSuffix = randomUUID();

    await prisma.question.createMany({
      data: [
        {
          title: 'Question 01',
          content: 'content',
          slug: `questions-01-${slugSuffix}`,
          authorId: user.id,
        },
        {
          title: 'Question 02',
          content: 'content',
          slug: `questions-02-${slugSuffix}`,
          authorId: user.id,
        },
        {
          title: 'Question 03',
          content: 'content',
          slug: `questions-03-${slugSuffix}`,
          authorId: user.id,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Question 01' }),
        expect.objectContaining({ title: 'Question 02' }),
        expect.objectContaining({ title: 'Question 03' }),
      ]),
    );
  });
});
