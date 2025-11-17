import { Module } from '@nestjs/common';
import { CreateAccountController } from './controller/create-account.controller';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule {}
