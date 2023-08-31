import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { TwofaService } from 'src/twofa/twofa.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [UserModule, PassportModule, PrismaModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d'},
  })],
  providers: [AuthService, TwofaService, ConfigService, PrismaService, JwtStrategy, UserService],
  exports: [AuthService],
})
export class AuthModule {}