import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthRegisterBodyDTO } from './dto/auth-register-body.dto';
import { AuthSigninBodyDTO } from './dto/auth-signin-body.dto';
import { AuthRefreshBodyDTO } from './dto/auth-refresh-body.dto';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAccessStrategy } from './strategies/auth.jwt.access.strategy';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  const apiTestKey = process.env['TEST_RIVERLEVEL_API_KEY'];
  const apiTestSecret = process.env['TEST_RIVERLEVEL_API_SECRET'];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule, JwtModule],
      controllers: [AuthController],
      providers: [AuthService, PrismaService, JwtAccessStrategy],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.riverlevel_api_key_tb.deleteMany({
      where: { description: 'jest tested' },
    });
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('register', () => {
    it('should be defined', () => {
      expect(authService.register).toBeDefined();
    });

    it('should be create new api key set', async () => {
      const body: AuthRegisterBodyDTO = {
        admin_key: process.env['AUTH_ADMIN_SECRET_KEY'],
        role: 'riverlevel',
        owner: 'testuser',
        description: 'jest tested',
      };

      const beforeAPIKeysLength = (
        await prismaService.riverlevel_api_key_tb.findMany()
      ).length;
      const newAPIKeySet = await authService.register(body);
      const afterAPIKeysLength = (
        await prismaService.riverlevel_api_key_tb.findMany()
      ).length;

      expect(afterAPIKeysLength).toBe(beforeAPIKeysLength + 1);
      expect(newAPIKeySet.api_key).toBeDefined();
      expect(typeof newAPIKeySet.api_key).toBe(typeof '');
      expect(newAPIKeySet.api_secret).toBeDefined();
      expect(typeof newAPIKeySet.api_secret).toBe(typeof '');
    });

    it('should throw UnauthorizedException', async () => {
      let error = null;
      try {
        const body: AuthRegisterBodyDTO = {
          admin_key: '',
          role: 'riverlevel',
          owner: 'testuser',
          description: 'jest tested',
        };
        await authService.register(body);
      } catch (e) {
        error = e;
        expect(e.message).toBe('Unauthorized');
      }
      expect(error).not.toBeNull();
    });
  });

  describe('signin', () => {
    it('should be defined', () => {
      expect(authService.signin).toBeDefined();
    });

    it('should be return JWT tokens', async () => {
      const body: AuthSigninBodyDTO = {
        api_key: apiTestKey,
        api_secret: apiTestSecret,
      };
      const jwtSet = await authService.signin(body);
      expect(jwtSet.access_token).toBeDefined();
      expect(typeof jwtSet.access_token).toBe(typeof '');
      expect(jwtSet.refresh_token).toBeDefined();
      expect(typeof jwtSet.refresh_token).toBe(typeof '');
    });

    it('should throw UnauthorizedExeption', async () => {
      let error = null;
      try {
        const body: AuthSigninBodyDTO = {
          api_key: '',
          api_secret: apiTestSecret,
        };
        await authService.signin(body);
      } catch (e) {
        error = e;
        expect(e.message).toBe('Unauthorized');
      }
      expect(error).not.toBeNull();
      error = null;

      try {
        const body: AuthSigninBodyDTO = {
          api_key: apiTestKey,
          api_secret: '',
        };
        await authService.signin(body);
      } catch (e) {
        error = e;
        expect(e.message).toBe('Unauthorized');
      }
      expect(error).not.toBeNull();
      error = null;
    });
  });

  describe('refresh', () => {
    it('should be defined', () => {
      expect(authService.refresh).toBeDefined();
    });

    it('should be return JWT tokens', async () => {
      const singinBody: AuthSigninBodyDTO = {
        api_key: apiTestKey,
        api_secret: apiTestSecret,
      };
      const signinJwtSet = await authService.signin(singinBody);

      const refreshBody: AuthRefreshBodyDTO = {
        refresh_token: signinJwtSet.refresh_token,
      };
      const refreshJwtSet = await authService.refresh(refreshBody);
      expect(refreshJwtSet.access_token).toBeDefined();
      expect(typeof refreshJwtSet.access_token).toBe(typeof '');
      expect(refreshJwtSet.refresh_token).toBeDefined();
      expect(typeof refreshJwtSet.refresh_token).toBe(typeof '');
    });
  });
});
