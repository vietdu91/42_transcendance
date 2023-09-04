import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Res } from '@nestjs/common';
import { kMaxLength } from 'buffer';



@Controller('profile')
export class UserController {
    constructor(private readonly userService: UserService,
                private readonly prisma: PrismaService) {}

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
      // console.log(request.cookies)
      const userId = request.cookies.id;
      if (!userId) {
        throw new UnauthorizedException();
      }
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new UnauthorizedException();
      }
      // console.log("nick = " + user.nickname)
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

    @Patch('disableTwoFA')
    async disableTwoFa( @Req() request: Request, @Body() body: {state: boolean}) {
      const userId = parseInt(request.cookies.id);
      console.log(userId);
      if (!userId)
        throw new UnauthorizedException();
      console.log("ici")
      this.userService.turnOffTwoFactorAuthentication(userId);
      return {message: 'Disabled 2FA'};
    }
  
    @Patch('setNickname')
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
      console.log("nickname == " + nickname);
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


}
