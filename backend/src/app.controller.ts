import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAccessAuthGuard } from './auth/guards/auth.jwt.access.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { Roles } from './decorator/roles.decorator';

@UseGuards(JwtAccessAuthGuard)
@Controller()
export class AppController {
  @Get('/test')
  @Roles('riverlevel')
  @UseGuards(RoleGuard)
  test() {
    return 'hello world';
  }
}
