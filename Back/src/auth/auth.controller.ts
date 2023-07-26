import { Controller, Get, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('Auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService,) {}

  @Get('conexion')
  async connexion(@Request() req, @Res({passthrough:true}) response): Promise<any> {
      console.log("Connexion route")
      const code = req.query.code;
      const user = await this.AuthService.apiConnexion(code, response);
      }
}
