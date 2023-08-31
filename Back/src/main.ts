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
  console.log(process.env.URL_LOCAL_F)
  app.enableCors({ origin: process.env.URL_LOCAL_F, credentials: true });
  app.use(cookieParser());
  app.use(passport.initialize());
  await app.listen(3001);

  const prisma = new PrismaClient();

  const app2 = express();
  app2.use(express.static(__dirname + "/static"));
  try{
    app2.get('/feed', async (req, res) => {
      // get and return all todos
      const todos = await prisma.todo.findMany();
      res.json(todos);
     });
  }
  catch{

  }
}
bootstrap();
