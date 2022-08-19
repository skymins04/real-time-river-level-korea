import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { generateApiKey } from 'generate-api-key';
import { AuthRegisterBodyDTO } from './dto/auth-register-body.dto';
import { AuthSigninBodyDTO } from './dto/auth-signin-body.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(body: AuthRegisterBodyDTO) {
    if (process.env['AUTH_ADMIN_SECRET_KEY'] === body.admin_key) {
      const apiKeySet = {
        api_key: generateApiKey({ method: 'base32' }).toString(),
        api_secret: generateApiKey({ method: 'base32' }).toString(),
      };
      await this.prismaService.riverlevel_api_key.create({
        data: {
          ...apiKeySet,
          role: body.role,
          owner: body.owner,
          description: body.description,
        },
      });
      return apiKeySet;
    }
    throw new UnauthorizedException();
  }

  async signin(body: AuthSigninBodyDTO) {
    const apiKeyRow = await this.prismaService.riverlevel_api_key.findUnique({
      where: { api_key: body.api_key },
    });
    if (
      apiKeyRow &&
      apiKeyRow.api_secret === body.api_secret &&
      apiKeyRow.enable
    ) {
      const accessToken = await this.jwtService.sign(
        { role: apiKeyRow.role },
        { expiresIn: '1h', secret: process.env['JWT_SECRET_KEY'] },
      );
      const refeshToken = await this.jwtService.sign(
        { role: apiKeyRow.role },
        { expiresIn: '7d', secret: process.env['JWT_SECRET_KEY'] },
      );

      return { accessToken, refeshToken };
    }
    throw new UnauthorizedException();
  }
}
