import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { Module } from '@nestjs/common';
// Décorateur qui permet de définir un module NestJS et de le rendre disponible pour d'autres modules
// Un module NestJS est une classe qui est décorée avec le décorateur @Module()
import { AppController } from './app.controller'; // ecouter une requête HTTP et renvoyer une réponse HTTP
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { TwofaModule } from './twofa/twofa.module';
import { TwofaService } from './twofa/twofa.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';


// Fournir des services à nos contrôleurs et à nos autres services

@Module({
  imports: [
    PrismaModule, PassportModule,  AuthModule, UserModule, AuthModule, TwofaModule,  PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [
    PrismaService, AppService, AuthService, UserService, TwofaService, ConfigService, JwtStrategy],
})
export class AppModule { }
