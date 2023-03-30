import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
        secret: 'secret', //make env variable
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 3600000 },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  //app.use(passport.authenticate('local', { session: false }));

  await app.listen(3000);
}
bootstrap();
