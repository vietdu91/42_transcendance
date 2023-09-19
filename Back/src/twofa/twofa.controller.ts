import { Controller, Get, Post, Body, UseGuards, Req, Res, HttpCode } from '@nestjs/common';
import { TwofaService } from './twofa.service';
import JwtAuthenticationGuard from '../jwt-guard/jwt-guard.guard';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import RequestWithUser from '../interface/requestWithUser.interface';
import { Request, Response } from 'express';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as qrcode from 'qrcode';
import { GetUser } from 'src/auth/decorator/get-user.decorator';


@Controller('twofa')
export class TwofaController {
  constructor(private readonly twofaService: TwofaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService) { }

  @Get('generate')
  @UseGuards(JwtAuthenticationGuard)
  async generateTwoFactorAuthenticatio(@GetUser() user: any, @Res() response: Response) {
    try {
      const { otpauthUrl } = await this.twofaService.generateTwoFactorAuthenticationSecret(user);
      const code = await qrcode.toDataURL(otpauthUrl);
      response.json({ code: code });
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async turnOnTwoFactorAuthentication(@GetUser() user: any, @Body() body: { code: string }) {
    try {
      const { code } = body;
      if (!user.twoFactorSecret) {
        throw new BadRequestException('2FA is not enabled for this user');
      }
      const isCodeValid = this.twofaService.isTwoFactorAuthenticationCodeValid(
        code, user
      );
      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong authentication code');
      }
      await this.userService.turnOnTwoFactorAuthentication(user.id);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
