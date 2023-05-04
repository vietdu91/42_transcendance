import { Controller, Get, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService} from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';


@Controller('Auth')
export class AuthController {
  constructor(private prisma: PrismaService,
              private readonly AuthService: AuthService,
              private readonly jwtService: JwtService ) {}

  @Get('conexion')
  async connexion(@Request() req, @Res({passthrough:true}) response): Promise<any> {
      console.log("Connexion route")
      const code = req.query.code;
      const user = await this.AuthService.apiConnexion(code, response);
      return response.redirect('http://localhost:3000');
      //return  response.redirect('http://localhost:3000/login/log?userId=' + user.id);
      }

}
