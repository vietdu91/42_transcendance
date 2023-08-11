import { Controller, Post, UseGuards, Req, Res, Query, Get, Redirect, Body, HttpCode, UploadedFile, UseInterceptors, Param} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { GameService } from './game/game.service';
import { Response,} from 'express';
import { Request } from 'express';
import JwtAuthenticationGuard from './jwt-guard/jwt-guard.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CloudinaryService } from './cloudinary/cloudinary.service';

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
    console.log("process.env.URL_REDIRECT = " + process.env.URL_REDIRECT)
    console.log("42 route");
    return {url: process.env.URL_42REDIRECT};
  }


    @Post('savedMessage')
    async createMessage(@Body() messageData: { content: string, authorId: number }, @Res() response: Response): Promise<void> {
      try {
        // Enregistrement du message dans la base de données
      //  const res =  await this.prisma.message.create({
      //     data: {
      //       content: messageData.content,
      //       author: { connect: { id: messageData.authorId } }, // Associer l'auteur (utilisateur)
      //     },
      //   });
        const newMessage = await this.prisma.message.create({
          data: {
            content: messageData.content,
            authorId: parseInt(messageData.authorId.toString()),
          },
        });
        response.status(201).json({ message: 'Message saved' });
      } catch (error) {
        // Gérer les erreurs
        console.log(error)
        throw new Error('Unable to save message.');
      }
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



