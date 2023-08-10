import { Controller, Post, UseGuards, Req, Res, Query, Get, Redirect, Body, HttpCode, UploadedFile, UseInterceptors, Param} from '@nestjs/common';
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
import * as cookieParser from 'cookie-parser';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Controller('Southtrans')
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly twofaService: TwofaService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly gameService: GameService,
    private cloudinary: CloudinaryService,
  ) {}

  @Get('42') 
  @Redirect('http://localhost:3001/Auth/connexion')
  getConnected() {
    console.log("42 route");
    return {url: "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-4ddb9a7637e5a92f4b3f663a47bfc753fcbfef4daf73ce630dc53f4363f740c8&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2FAuth%2Fconnexion&response_type=code"};
  }

  @Get('getUserById')
  async getUserById(@Query('userId') userId: number, @Req() request: Request, @Res() response: Response) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    response.json({
      id: user.id,
      email: user.email,
      name: user.name,
      twoFA: user.twoFactorEnabled,
      nick: user.nickname,
      age: user.age,
      character: user.character,});
  }

  @Get('getUser')
  async getUser(@Req() request: Request, @Res() response: Response) {
    const userId = request.cookies.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    console.log("nick = " + user.nickname)
    response.json({
      id: user.id,
      email: user.email,
      name: user.name,
      twoFA: user.twoFactorEnabled,
      nick: user.nickname,
      age: user.age,
      character: user.character,
      pfp_url: user.pfp_url,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string){
    console.log("Mon id:", id);
    return this.userService.findOne(id);
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


/*
    LOCAL IMG UPLOAD
*/

  //   @Post('local')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: 'public/img',
  //       filename: (req, file, cb) => {
  //         cb(null, file.originalname);
  //       },
  //     }),
  //   }),
  // )
  // async local(@UploadedFile() file: Express.Multer.File) {
  //   return {
  //     statusCode: 200,
  //     data: file.path,
  //   };
  // }

/*
    ONLINE IMG UPLOAD
*/

@Post('online')
@UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async online(@Req() request: Request, @UploadedFile() file: Express.Multer.File) {
    const accessToken = request.headers.authorization?.split(' ')[1];
    console.log("Access token: " + accessToken);
    const decodedJwtAccessToken: any = this.jwtService.decode(accessToken);
    return await this.cloudinary
      .uploadImage(file)
      .then((data) => {
        return this.prisma.user.update({
          where: { id: decodedJwtAccessToken.sub },
          data: { pfp_url: data.secure_url },
        });
      })
      .catch((err) => {
        return {
          statusCode: 400,
          message: err.message,
        };
      });
  }

}

