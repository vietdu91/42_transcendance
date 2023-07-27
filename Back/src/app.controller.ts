import { Controller, Post, UseGuards, Req, Res,Headers, Get, Redirect, Body, HttpCode } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { GameService } from './game/game.service';
import { Response,} from 'express';
import { Request } from 'express';
import * as qrcode from 'qrcode';
import { TwofaService } from './twofa/twofa.service';
import RequestWithUser from './interface/requestWithUser.interface';
import JwtAuthenticationGuard from './jwt-guard/jwt-guard.guard';
import { AuthService } from './auth/auth.service';
import { BadRequestException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';

@Controller('Southtrans')
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly twofaService: TwofaService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly gameService: GameService,
  ) {}

  @Get('42') 
  @Redirect(process.env.URL_REDIRECT)
  getConnected() {
    console.log("process.env.URL_REDIRECT = " + process.env.URL_REDIRECT)
    console.log("42 route");
    return {url: process.env.URL_42REDIRECT};
  }

  @Get('getUserById')
  async getUserById(@Req() request: Request, @Res() response: Response, @Body() body: { userId: number }) {
    const { userId } = body;
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    response.json({user: user});
  }

  @Get('getUser')
  async getUser(@Req() request: Request, @Res() response: Response) {
    // console.log(request.cookies)
    const userId = request.cookies.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    // console.log("nick = " + user.nickname)
    response.json({
      id: user.id,
      email: user.email,
      name: user.name,
      twoFA: user.twoFactorEnabled,
      nick: user.nickname,
      age: user.age,
      character: user.character,
    });
  }

  @Post('setNickname')
  async setNickname( @Req() request, @Body() body: { nickname: string }) {
    const userId = request.cookies.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const { nickname } = body;
    if (!nickname)
      throw new UnauthorizedException();
     const userUpdate = await this.prisma.user.update({
       where: { id: Number(userId) },
       data: { nickname: nickname },
    });
    // if (!userUpdate) {
    //   throw new BadRequestException('Impossible de mettre à jour le surnom');
    // }
    return { message: 'Surnom enregistré avec succès' };
  }

  @Post('setAge')
  async setAge( @Req() request, @Body() body: { age: number }) {
    const userId = request.cookies.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const { age } = body;
    if (!age)
      throw new UnauthorizedException();
    const userUpdate = await this.prisma.user.update({
        where: { id: Number(userId) },
        data: { age: Number(age) },
    });
      // if (!userUpdate) {
    //   throw new BadRequestException('Impossible de mettre à jour le surnom');
    // }
    return { message: 'Age enregistré avec succès' };
  }

  @Post('setCharacter')
  async setCharacter( @Req() request, @Body() body: { character: string }) {
    const userId = request.cookies.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const { character } = body;
    const userUpdate = await this.prisma.user.update({
        where: { id: Number(userId) },
        data: { character: character },
    });
    //   if (!userUpdate) {
    //   throw new BadRequestException('Impossible de mettre à jour le surnom');
    // }
    return { message: 'Personnage modifié avec succès' };
  }
  
  @Post('logout')
  @UseGuards(JwtAuthenticationGuard)
  async logout(@Req() request: Request, @Res() response: Response) {
    console.log("logout ON");
    try {
      const accessToken = request.headers.authorization?.split(' ')[1];
      console.log("Access token: " + accessToken);
      const decodedJwtAccessToken: any = this.jwtService.decode(accessToken);
      //const expires = decodedJwtAccessToken.exp;
      const user = await this.userService.getUserById(decodedJwtAccessToken.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      await this.prisma.user.update({
        where: { id: user.id },
        data: { accessToken: null },
      });
      console.log("logout2");
      response.clearCookie('accessToken');
      response.clearCookie('id');
      response.status(200).json("app-back: successfully logged out.")
    }
    catch (err) {
      console.log("app-back: user logged fail.")
      response.status(404)
    }
  }

  
  @Get('2fa/generate')
  @UseGuards(JwtAuthenticationGuard)
  async generateTwoFactorAuthenticatio(@Req() request: Request, @Res() response: Response)  {           
   const accessToken = request.headers.authorization?.split(' ')[1];
    console.log("Access token: " + accessToken);  
    const decodedJwtAccessToken: any = this.jwtService.decode(accessToken);
    console.log("decodedJwtAccessToken: " + decodedJwtAccessToken.sub);
    //const expires = decodedJwtAccessToken.exp;
    const user = await this.userService.getUserById(decodedJwtAccessToken.sub);
    console.log("user == " + user)
    const { otpauthUrl } = await this.twofaService.generateTwoFactorAuthenticationSecret(user);
    //return this.twofaService.pipeQrCodeStream(response, otpauthUrl);
    const code = await qrcode.toDataURL(otpauthUrl);
    response.json({code: code});
  }


    @Post('2fa/turn-on')
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async turnOnTwoFactorAuthentication(@Req() request: RequestWithUser,
    @Body('twoFactorAuthenticationCode') twoFactorAuthenticationCode: string
    )  {
      console.log("turnOnTwoFactorAuthenticationCode = " + twoFactorAuthenticationCode);
      const userId =request.user.id;
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
}

