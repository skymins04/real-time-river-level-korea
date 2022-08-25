import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CrawlingModule } from './crawling/crawling.module';

@Module({
  controllers: [],
  providers: [],
  imports: [AuthModule, CrawlingModule],
})
export class AppModule {}
