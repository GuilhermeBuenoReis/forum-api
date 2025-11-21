import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentRepository } from './prisma/repositories/prisma-answer-attachments';
import { PrismaAnswerCommentRepository } from './prisma/repositories/prisma-answer-comments-repository';
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answers-repository';
import { PrismaQuestionsAttachmentsRepository } from './prisma/repositories/prisma-questions-attachments-repository';
import { PrismaQuestionsCommentRepository } from './prisma/repositories/prisma-questions-comment';
import { PrismaQuestionsRepositoryRepository } from './prisma/repositories/prisma-questions-repository';

@Module({
  providers: [
    PrismaService,
    PrismaQuestionsAttachmentsRepository,
    PrismaQuestionsCommentRepository,
    PrismaQuestionsRepositoryRepository,
    PrismaAnswerAttachmentRepository,
    PrismaAnswerCommentRepository,
    PrismaAnswerRepository,
  ],
  exports: [PrismaService],
})
export class DatabaseModule {}
