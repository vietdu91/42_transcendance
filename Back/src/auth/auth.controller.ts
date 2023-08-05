import { Controller, Get, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Controller('Auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService,
              private prisma: PrismaService,) {}

  @Get('conexion')
  async connexion(@Request() req, @Res({passthrough:true}) response): Promise<any> {
    console.log("Connexion route")
    const code = req.query.code;
    const accessToken = await this.AuthService.getAccessToken(code);
    const userData = await this.AuthService.getUserData(accessToken);
    const user = await this.AuthService.apiConnexion(userData, response);
    var user2 = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (user2)
      response.redirect("http://localhost:3000");
    else
      response.redirect("http://localhost:3000/newprofile");
      
    //console.log("redirect to http://localhost:3000/newprofile");
    }
}
