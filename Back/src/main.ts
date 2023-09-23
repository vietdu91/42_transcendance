import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
const express = require("express");
const { PrismaClient } = require("@prisma/client");
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.URL_LOCAL_F, credentials: true });
  app.use(cookieParser());
  app.use(passport.initialize());
  await app.listen(3001);

  const prisma = new PrismaClient();

}
bootstrap();
