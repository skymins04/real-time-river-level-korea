import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/auth/guards/auth.jwt.access.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { CrawlingService } from './crawling.service';
import {
  CreateCrawlingRivergaugeBodyDTO,
  UpdateCrawlingRivergaugeBodyDTO,
} from './dto/crawling-rivergauge-body.dto';
import { CreateCrawlingRiverlevelBodyDTO } from './dto/crawling-riverlevel-body.dto';

@UseGuards(JwtAccessAuthGuard)
@Controller('crawling')
export class CrawlingController {
  constructor(private readonly crawlingService: CrawlingService) {}

  @Post('riverlevel')
  @Roles('crawler')
  @UseGuards(RoleGuard)
  async setRiverlevel(@Body() body: CreateCrawlingRiverlevelBodyDTO) {
    return await this.crawlingService.setRiverlevel(body);
  }

  @Post('rivergauge')
  @Roles('crawler')
  @UseGuards(RoleGuard)
  async setRivergauge(@Body() body: CreateCrawlingRivergaugeBodyDTO) {
    return await this.crawlingService.setRivergauge(body);
  }

  @Patch('rivergauge')
  @Roles('crawler')
  @UseGuards(RoleGuard)
  async updateRivergauge(@Body() body: UpdateCrawlingRivergaugeBodyDTO) {
    return await this.crawlingService.updateRivergauge(body);
  }
}
