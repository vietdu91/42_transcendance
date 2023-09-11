import { Controller, Get, Post, Body, UseGuards, Req, Res, HttpCode} from '@nestjs/common';
import { TwofaService } from './twofa.service';
import JwtAuthenticationGuard from '../jwt-guard/jwt-guard.guard';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import RequestWithUser from '../interface/requestWithUser.interface';
import { Request, Response } from 'express';
import { UnauthorizedException , BadRequestException} from '@nestjs/common';
import * as qrcode from 'qrcode';


@Controller('twofa')
export class TwofaController {
  constructor(private readonly twofaService: TwofaService, 
              private readonly jwtService: JwtService,
              private readonly userService: UserService) {}

  @Get('generate')
  @UseGuards(JwtAuthenticationGuard)
  async generateTwoFactorAuthenticatio(@Req() request: Request, @Res() response: Response)  {   
    const accessToken = request.headers.authorization?.split(' ')[1];
    console.log("Access token: " + accessToken);  
    const decodedJwtAccessToken: any = this.jwtService.decode(accessToken);
    console.log("decodedJwtAccessToken: " + decodedJwtAccessToken.sub);
    //const expires = decodedJwtAccessToken.exp;
    const user = await this.userService.getUserById(decodedJwtAccessToken.sub);
    console.log("user == " + user.name)
    const { otpauthUrl } = await this.twofaService.generateTwoFactorAuthenticationSecret(user);
    //return this.twofaService.pipeQrCodeStream(response, otpauthUrl);
    const code = await qrcode.toDataURL(otpauthUrl);
    response.json({code: code});
  }

    @Post('turn-on')
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async turnOnTwoFactorAuthentication(@Req() request: Request, @Body() body: { code: string })
    {
      const { code } = body;
      console.log("code = " + code);
      const id = parseInt(request.cookies.id);
      const user = await this.userService.getUserById(id);
      if (!user.twoFactorSecret) {
        throw new BadRequestException('2FA is not enabled for this user');
      }
      const isCodeValid = this.twofaService.isTwoFactorAuthenticationCodeValid(
        code, user
      );
      console.log("isCodeValid = " + isCodeValid)
      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong authentication code');
      }
      await this.userService.turnOnTwoFactorAuthentication(id);
    }
}
