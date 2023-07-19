import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as http from 'http';

config();

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const httpServer = http.createServer(server);
  httpServer.setTimeout(10000); // Set the timeout value in milliseconds (5 seconds)

  await app.init();
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  app.use(cookieParser());
  app.use(passport.initialize());
  await app.listen(3001);
}
bootstrap();
