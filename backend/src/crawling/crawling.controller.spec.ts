import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { CrawlingController } from './crawling.controller';
import { CrawlingService } from './crawling.service';

describe('CrawlingController', () => {
  let controller: CrawlingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrawlingController],
      providers: [CrawlingService, PrismaService],
    }).compile();

    controller = module.get<CrawlingController>(CrawlingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
