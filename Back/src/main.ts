import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.URL_LOCAL_F)
  app.enableCors({ origin: process.env.URL_LOCAL_F, credentials: true });
  app.use(cookieParser());
  app.use(passport.initialize());
  await app.listen(3001);
}
bootstrap();
