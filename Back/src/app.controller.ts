import { Controller, Post, UseGuards, Req, Res,Headers, Get, Redirect, Body, Request, HttpCode } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { Response} from 'express';
import { TwofaService } from './twofa/twofa.service';
import RequestWithUser from './interface/requestWithUser.interface';
import JwtAuthenticationGuard from './jwt-guard/jwt-guard.guard';
import { AuthService } from './auth/auth.service';
import { BadRequestException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

@Controller('Southtrans')
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('42') 
  @Redirect("")
  getConnected(@Request() req) {
    console.log("42 route");
    return {url: "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c28548ef4a6bc80adc6fbb6414520b8afb6ff47cfb674bdd8fabbca9e8b53467&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2FAuth%2Fconexion&response_type=code"};
  }

  // @Get('logout')
  // async logout(@Req() request: Request, @Res() response: Response) {
  //   console.log("logout");
  //   const userId = request.cookies.id;
  //   if (!userId) {
  //     throw new UnauthorizedException();
  //   }
  //   const user = await this.userService.getUserById(userId);
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   await this.prisma.user.update({
  //     where: { id: user.id },
  //     data: { accessToken: null },
  //   });
  //   response.clearCookie('token');
  //   response.clearCookie('id');
  //   response.redirect('http://localhost:3000/connect');
  //}
}


@Controller('2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twofaService: TwofaService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}
  
  @Post('generate')
  @UseGuards(JwtAuthenticationGuard)
  async generateTwoFactorAuthentication(@Req() request: RequestWithUser,
                                        @Res() response: Response) {
    console.log(request.user);
    const { otpauthUrl } = await this.twofaService.generateTwoFactorAuthenticationSecret(request.user);
 
    return this.twofaService.pipeQrCodeStream(response, otpauthUrl);
  }

    @Post('turn-on')
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async turnOnTwoFactorAuthentication(
      @Req() request: RequestWithUser,
      //@Headers('Authorization') authHeader: string,
      @Body('twoFactorAuthenticationCode') twoFactorAuthenticationCode: string
    )  {
      console.log("turnOnTwoFactorAuthenticationCode = " + twoFactorAuthenticationCode);
      const user = await this.userService.getUserById(request.user.id);
      if (!user.twoFactorSecret) {
        throw new BadRequestException('2FA is not enabled for this user');
      }
      const isCodeValid = this.twofaService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode, user
      );
      console.log("isCodeValid = " + isCodeValid)
      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong authentication code');
      }
      await this.userService.turnOnTwoFactorAuthentication(request.user.id);
    }
    // ...
  }
