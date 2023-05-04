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

@Controller('Login')
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('log')
  async login(@Body() body: { userId: string }): Promise<any> {
    console.log('Post login');
    const userId = parseInt(body.userId);
    console.log(userId);
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.authService.login(user);
    console.log(jwt);
    return jwt;
  }
   

  @Get('42') 
  @Redirect("")
  getConnected(@Request() req) {
    console.log("42 route");
    return {url: "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0cce972308f0f6be06570a9ddeaacaf86d8d76148d7c2514184539f693b54491&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FAuth%2Fconexion&response_type=code"};
  }
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

    const accessToken = this.jwtService.sign({ userId: request.user.id });
    //AccesToken JWT (Json Web Token) use to authenticate user with 2FA code

    //console.log(otpauthUrl);

    response.setHeader('Authorization', `Bearer ${accessToken}`);
 
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
