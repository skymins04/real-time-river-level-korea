import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { generateApiKey } from 'generate-api-key';
import { AuthRegisterBodyDTO } from './dto/auth-register-body.dto';
import { AuthSigninBodyDTO } from './dto/auth-signin-body.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthRefreshBodyDTO } from './dto/auth-refresh-body.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 허가된 토큰의 권한 정보를 포함한 Access Token과 Refresh Token을 발행하는 메서드
   * @param role 토큰의 권한
   * @returns 허가된 권한 정보를 포함한 Access Token과 Refresh Token
   */
  private getJWTTokens = async (role) => {
    const access_token = await this.jwtService.sign(
      { role },
      { expiresIn: '1h', secret: process.env['JWT_ACCESS_SECRET_KEY'] },
    );
    const refresh_token = await this.jwtService.sign(
      { role },
      { expiresIn: '7d', secret: process.env['JWT_REFRESH_SECRET_KEY'] },
    );
    return { access_token, refresh_token };
  };

  /**
   * [POST] /auth/register 엔드포인트의 서비스 메서드
   * @param body post body
   * @returns 요청 결과
   */
  async register(body: AuthRegisterBodyDTO) {
    if (process.env['AUTH_ADMIN_SECRET_KEY'] === body.admin_key) {
      const apiKeySet = {
        api_key: generateApiKey({ method: 'base32' }).toString(),
        api_secret: generateApiKey({ method: 'base32' }).toString(),
      };
      await this.prismaService.riverlevel_api_key_tb.create({
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

  /**
   * [POST] /auth/signin 엔드포인트의 서비스 메서드
   * @param body post body
   * @returns 요청 결과
   */
  async signin(body: AuthSigninBodyDTO) {
    const apiKeyRow = await this.prismaService.riverlevel_api_key_tb.findUnique(
      {
        where: { api_key: body.api_key },
      },
    );
    if (
      apiKeyRow &&
      apiKeyRow.api_secret === body.api_secret &&
      apiKeyRow.enable
    ) {
      return this.getJWTTokens(apiKeyRow.role);
    }
    throw new UnauthorizedException();
  }

  /**
   * [POST] /auth/refresh 엔드포인트의 서비스 메서드
   * @param body post body
   * @returns 요청 결과
   */
  async refresh(body: AuthRefreshBodyDTO) {
    const decodedRefreshToken = this.jwtService.decode(body.refresh_token);
    return this.getJWTTokens(decodedRefreshToken['role']);
  }
}
