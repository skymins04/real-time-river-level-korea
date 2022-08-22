import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { CrawlingController } from './crawling.controller';
import { CrawlingService } from './crawling.service';

describe('CrawlingService', () => {
  let service: CrawlingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrawlingController],
      providers: [CrawlingService, PrismaService],
    }).compile();

    service = module.get<CrawlingService>(CrawlingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
