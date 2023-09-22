import { Controller, Get, Res, Post, Patch, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, } from 'express';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import JwtAuthenticationGuard from '../jwt-guard/jwt-guard.guard';
import { UserService } from '../user/user.service';
import { TwofaService } from 'src/twofa/twofa.service';


@Controller('Auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService,
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly twoFaService: TwofaService) { }

  @Get('connexion')
  async connexion(@Req() req, @Res() response): Promise<any> {
    try {
      const code = req.query.code;
      const accessToken = await this.AuthService.getAccessToken(code);
      const userData = await this.AuthService.getUserData(accessToken);
      await this.AuthService.apiConnexion(userData, accessToken, response);
    } catch {
      throw new BadRequestException();
    }
  }

  @Patch('checkNickname')
  async checkNickname(@Res() res, @Body() body: { nickname: string, token: string }) {
    const { nickname, token } = body;
    try {
      const user = await this.prisma.user.findUnique({ where: { nickname: nickname } });
      if (user !== null) {
        throw new BadRequestException("already used");
      }
      const regex: RegExp = /^[a-zA-Z0-9\s\-\_]{2,20}$/;
      if (!regex.test(nickname))
        throw new BadRequestException("wrong regex");
      await this.AuthService.connexionPostNickname(token, nickname, res);
    } catch (err) {
      throw err;
    }
  }

  @Get('connect2fa')
  async connect2fa(@Req() req: any, @Res() res: any) {
    try {
      const code = req.query.code;
      const id = req.query.id;
      const user = await this.userService.getUserById(id);
      if (!user.twoFactorSecret || !user.twoFactorEnabled) {
        throw new BadRequestException('2Fa is not enabled for this user');
      }
      const isCodeValid = this.twoFaService.isTwoFactorAuthenticationCodeValid(code, user);
      if (!isCodeValid) {
        throw new BadRequestException('Wrong authentication code');
      }
      await this.AuthService.apiConnexion2fa(user, res);
      await this.prisma.user.update({
        where: { id: 1 },
        data: { state: 'ONLINE' },
      })
      res.status(200).json({ message: 'Connexion réussie' });
    } catch {
      throw new BadRequestException();
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthenticationGuard)
  async logout(@Req() request: Request, @Res() response: Response) {
    try {
      const accessToken = request.headers.authorization?.split(' ')[1];
      const decodedJwtAccessToken: any = this.jwtService.decode(accessToken);
      const user = await this.userService.getUserById(decodedJwtAccessToken.sub);
      if (!user) {
        throw new BadRequestException();
      }
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          accessToken: null,
          state: 'OFFLINE',
        },
      });
      response.status(200).json({ message: 'Déconnexion réussie' });
    }
    catch {
      response.status(404);
    }
  }
}

