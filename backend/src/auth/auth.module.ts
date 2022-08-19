import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from './strategies/auth.jwt.access.strategy';
import { JwtRefreshStrategy } from './strategies/auth.jwt.refresh.strategy';

@Module({
  imports: [PassportModule, JwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
