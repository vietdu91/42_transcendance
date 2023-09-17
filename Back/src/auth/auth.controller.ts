import { Controller, Get, Res, Post, Query, UseGuards , Req, UnauthorizedException, BadRequestException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response,} from 'express';
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
              private readonly twoFaService: TwofaService) {}

  @Get('connexion')
  async connexion(@Req() req, @Res() response): Promise<any> {
    console.log("Connexion route")
    const code = req.query.code;
    const accessToken = await this.AuthService.getAccessToken(code);
    const userData = await this.AuthService.getUserData(accessToken);
    const user = await this.AuthService.apiConnexion(userData, response);
  }

  @Get('connect2fa')
  async connect2fa(@Query('code') code: string, @Req() req: Request, @Res() res: Response) {
    const userId = parseInt(req.cookies.id);
    const user = await this.userService.getUserById(userId);
    if (!user.twoFactorSecret || !user.twoFactorEnabled)
      throw new BadRequestException('2Fa is not enabled for this user');
    const isCodeValid = this.twoFaService.isTwoFactorAuthenticationCodeValid(code, user);
    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code');
    await this.AuthService.apiConnexion2fa(user, res);
    await this.prisma.user.update({
      where: {id: userId},
      data: {state: 'ONLINE'},
    })
    res.status(200).json({ message: 'Connexion réussie' });
  }

  @Post('logout')
  @UseGuards(JwtAuthenticationGuard)
  async logout(@Req() request: Request, @Res() response: Response) {
    console.log("logout ON");
    try {
      const accessToken = request.headers.authorization?.split(' ')[1];
      const decodedJwtAccessToken: any = this.jwtService.decode(accessToken);
      const user = await this.userService.getUserById(decodedJwtAccessToken.sub);
      if (!user) {
        throw new UnauthorizedException();
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
    catch (err) {
      console.log("app-back: user logged fail.")
      response.status(404)
    }
  }
}

