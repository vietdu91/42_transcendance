import { Controller, Get, Post , Redirect, Request, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/guard/local-auth.guard';
import { AuthenticatedGuard } from './auth/guard/authenticated.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): any {
    console.log(req.user);
    return req.user;
  }


  @UseGuards(AuthenticatedGuard)
  @Get('protected')
  getHello(@Request() req): string {
    console.log(req);
    return req.user;
  }

  @Get('connected')
  @Redirect("")
  getConnected(@Request() req) {
    return {url: "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c942f091fab8ce17c782da53e2aecd9bd74b4d14c52e4a58ce83d2acb9a7b848&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fconnexion&response_type=code"}
  }
}

