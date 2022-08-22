import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateCrawlingRivergaugeBodyDTO,
  UpdateCrawlingRivergaugeBodyDTO,
} from './dto/crawling-rivergauge-body.dto';
import { CreateCrawlingRiverlevelBodyDTO } from './dto/crawling-riverlevel-body.dto';

@Injectable()
export class CrawlingService {
  constructor(private readonly prismaService: PrismaService) {}

  async setRiverlevel(body: CreateCrawlingRiverlevelBodyDTO) {
    return true;
  }

  async setRivergauge(body: CreateCrawlingRivergaugeBodyDTO) {
    return true;
  }

  async updateRivergauge(body: UpdateCrawlingRivergaugeBodyDTO) {
    return true;
  }
}
