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

    @Get('getUserByName')
    async getUserByName(@Query('username') username: string, @Req() request: Request, @Res() response: Response) {
      console.log(username + " ICICIICCIICIC");
      const user = await this.userService.getUserByName(username);
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
        character: user.character,
        pfp_url: user.pfp_url,
      });
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
      let percentage: number = user.looses === 0 ? 0 : Math.round(user.wins / (user.wins + user.looses) * 100);

      const games = await this.userService.getGamesByUserId(userId);

      console.log(games);

      response.json({
        id: user.id,
        email: user.email,
        name: user.name,
        twoFA: user.twoFactorEnabled,
        nick: user.nickname,
        age: user.age,
        character: user.character,
        pfp_url: user.pfp_url,
        wins: user.wins,
        looses: user.looses,
        percentage: percentage,
        games: games,
      });
    }
    @Get(':id')
    findOne(@Param('id') id: string){
      console.log("Mon id:", id);
      return this.userService.findOne(id);
    }

    @Post('addFriend')
    async addFriend( @Req() request, @Body() body: {id: number}) {;
      console.log("On y arrive pour addFriend jusqu'ici ouuuuuu");
      const userId = request.cookies.id;
      if (!userId) {
        throw new UnauthorizedException();
      }
      console.log("userId: " + userId);

      const { id } = body;
      console.log("id: " + id);
      if (!id) {
        throw new UnauthorizedException();
      }
      const user = await this.prisma.user.findUnique({
        where: {id: Number(userId) }
      })
      console.log(userId);
      const userUpdate = await this.prisma.user.update({
        where: { id: Number(userId) },
        data: {friendList: user.friendList.push(id)},
      })
      console.log("FRIEND ADDED: travail termine");
    }
    @Post('removeFriend')
    async removeFriend( @Req() request, @Body() body: {id: number}) {
      console.log("Removing friend...")
      const userId = request.cookies.id;
      if (!userId) {
        throw new UnauthorizedException();
      }
      console.log("id de l'user qui delete: " + userId)
      const { id } = body;
      if (!id) {
        throw new UnauthorizedException();
      }
      const user = await this.prisma.user.findUnique({
        where: {id: Number(userId) }
      })
      console.log("id de l'user a delete: " + id)
      let array = user.friendList;
      // while(array != 0)
      // {
      //   console.log(id);
      //   array--;
      // }
      const index = array.indexOf(id, 0);
      if (index > -1) {
        array.splice(index, 1);
        const userUpdate = await this.prisma.user.update({
        where: { id: Number(userId) },
        data: {friendList: array},
        })
        console.log("FRIEND REMOVED: travail termine");
      }
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
