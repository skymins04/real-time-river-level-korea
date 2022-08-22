import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CrawlingController } from './crawling.controller';
import { CrawlingService } from './crawling.service';

@Module({
  controllers: [CrawlingController],
  providers: [CrawlingService, PrismaService],
})
export class CrawlingModule {}
