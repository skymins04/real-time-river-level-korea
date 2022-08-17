import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterBodyDTO } from './dto/auth-register-body.dto';
import { AuthSigninBodyDTO } from './dto/auth-signin-body.dto';

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

  @Post('refresh')
  refresh() {
    return true;
  }
}
