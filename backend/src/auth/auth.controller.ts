import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthRefreshBodyDTO } from './dto/auth-refresh-body.dto';
import { AuthRegisterBodyDTO } from './dto/auth-register-body.dto';
import { AuthSigninBodyDTO } from './dto/auth-signin-body.dto';
import { AuthService } from './auth.service';
import { JwtRefreshAuthGuard } from './guards/auth.jwt.refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: AuthRegisterBodyDTO) {
    return await this.authService.register(body);
  }

  @Post('signin')
  async signin(@Body() body: AuthSigninBodyDTO) {
    return await this.authService.signin(body);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Body() body: AuthRefreshBodyDTO) {
    return await this.authService.refresh(body);
  }
}
