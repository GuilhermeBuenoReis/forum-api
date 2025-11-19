import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/infra/auth/jwt.auth.guard';
import type { UserPayload } from 'src/infra/auth/jwt-strategy';
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation-pipes';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import z from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content } = body;
    const { sub: userId } = user;

    const slug = this.convertToSlug(title);

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    });
  }

  private convertToSlug(slug: string): string {
    return slug
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
