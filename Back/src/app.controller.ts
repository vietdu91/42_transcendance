import { Controller, Post, UseGuards, Get, Redirect, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { GameService } from './game/game.service';
import { Response,} from 'express';
import { Request } from 'express';
import JwtAuthenticationGuard from './jwt-guard/jwt-guard.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { GetUser } from './auth/decorator/get-user.decorator';

@Controller('Southtrans')
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly gameService: GameService,
    private cloudinary: CloudinaryService,
  ) {}

  @Get('42') 
  @Redirect(process.env.URL_REDIRECT)
  getConnected() {
    return {url: process.env.URL_42REDIRECT};
  }

@Post('online')
@UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async online(@GetUser() user: any, @UploadedFile() file: Express.Multer.File) {
    try {
      return await this.cloudinary
        .uploadImage(file)
        .then((data) => {
          return this.prisma.user.update({
            where: { id: user.id },
            data: { pfp_url: data.secure_url },
          });
        })
        .catch((err) => {
          throw err;
        });
    } catch {
      throw new BadRequestException();
    }
  }

}



