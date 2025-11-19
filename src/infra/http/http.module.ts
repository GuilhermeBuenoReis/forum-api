import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticateController } from './controller/authenticate.controller';
import { CreateAccountController } from './controller/create-account.controller';
import { CreateQuestionController } from './controller/create-questions.controller';
import { FetchRecentQuestionController } from './controller/fetch-recent-question.controller';

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
