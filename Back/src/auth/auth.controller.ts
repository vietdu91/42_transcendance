import { Controller, Get, Res, Post, UseGuards , Req, UnauthorizedException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response,} from 'express';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import JwtAuthenticationGuard from '../jwt-guard/jwt-guard.guard';
import { UserService } from '../user/user.service';


@Controller('Auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService,
              private prisma: PrismaService,
              private readonly jwtService: JwtService,
              private readonly userService: UserService) {}

  @Get('connexion')
  async connexion(@Req() req, @Res() response): Promise<any> {
    console.log("Connexion route")
    const code = req.query.code;
    const accessToken = await this.AuthService.getAccessToken(code);
    const userData = await this.AuthService.getUserData(accessToken);
    const user = await this.AuthService.apiConnexion(userData, response);
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
        data: { accessToken: null },
      });
      response.status(200).json({ message: 'Déconnexion réussie' });
    }
    catch (err) {
      console.log("app-back: user logged fail.")
      response.status(404)
    }
  }
}

