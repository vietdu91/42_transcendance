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

import { GameService } from './game/game.service';
import { GameController } from './game/game.controller';

import { ChatService } from './chat/chat.service';
import { ChatController } from './chat/chat.controller';

import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { TwofaModule } from './twofa/twofa.module';
import { TwofaService } from './twofa/twofa.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ChatGateway } from './chat/chat.gateway';
import { MatchmakingGateway } from './game/game.gateway';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Fournir des services à nos contrôleurs et à nos autres services

@Module({
  imports: [
    PrismaModule, AuthModule, UserModule, AuthModule, TwofaModule,  PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    CloudinaryModule,
  ],
  controllers: [AppController, UserController, AuthController, GameController, ChatController],
  providers: [
    PrismaService, AppService, AuthService, UserService, TwofaService, ConfigService, JwtStrategy, ChatService, ChatGateway, MatchmakingGateway, GameService],
})
export class AppModule {}
