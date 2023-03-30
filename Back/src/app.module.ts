
import { Module } from '@nestjs/common';
// Décorateur qui permet de définir un module NestJS et de le rendre disponible pour d'autres modules
// Un module NestJS est une classe qui est décorée avec le décorateur @Module()
import { AppController } from './app.controller';
// ecouter une requête HTTP et renvoyer une réponse HTTP
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/strategy/local.strategy';




// Fournir des services à nos contrôleurs et à nos autres services

@Module({
  imports: [PassportModule, UsersModule],
  controllers: [ AppController],
  providers: [AppService, AuthService, LocalStrategy],
})
export class AppModule { }
