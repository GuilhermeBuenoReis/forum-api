import { Injectable } from '@nestjs/common';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionRepository } from '@/domain/forum/application/repositories/questions-repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionsRepositoryRepository implements QuestionRepository {
  constructor(private prisma: PrismaService) {}

  async findById(questionId: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  findBySlug(slug: string): Promise<Question | null> {
    throw new Error('Method not implemented.');
  }

  findManyRecent(params: PaginationParams): Promise<Question[]> {
    throw new Error('Method not implemented.');
  }

  create(question: Question): Promise<void> {
    throw new Error('Method not implemented.');
  }

  save(question: Question): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(question: Question): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
