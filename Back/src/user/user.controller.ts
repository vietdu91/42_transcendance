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
      let percentage: number = user.wins + user.looses === 0 ? 0 : Math.round(user.wins / (user.wins + user.looses) * 100);

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

    @Get('getLeaderboard')
    async getLeaderboard(@Req() request: Request, @Res() response: Response) {
      const users = await this.userService.getLeaderboard();
      users.sort((a, b) => b.winrate - a.winrate);
      response.json({users: users});
    }

    @Post('addFriend')
    async addFriend( @Req() request, @Body() body: {name: string}) {;
      console.log("On y arrive pour addFriend jusqu'ici ouuuuuu");
      const userId = request.cookies.id;
      if (!userId) {
        throw new UnauthorizedException();
      }
      console.log("userId: " + userId);

      const { name } = body;
      console.log("name: " + name);
      if (!name) {
        throw new UnauthorizedException();
      }
      const user = await this.prisma.user.findUnique({
        where: {name: name }
      })
      if(user.id == userId){
        console.log("user.id === userId");
        throw new UnauthorizedException();
      }
      console.log(userId + " " + user.id + " " + name);
      const userUpdate = await this.prisma.user.update({
        where: { id:  Number(userId)},
        data: {friendsList: user.friendsList.push(user.id)},
      })
      console.log("FRIEND ADDED: travail termine");
    }

    @Post('addBlocked')
    async addBlocked( @Req() request, @Body() body: {name: string}) {;
      console.log("On y arrive pour addBlocked jusqu'ici ouuuuuu");
      const userId = request.cookies.id;
      if (!userId) {
        throw new UnauthorizedException();
      }
      console.log("userId: " + userId);

      const { name } = body;
      console.log("name: " + name);
      if (!name) {
        throw new UnauthorizedException();
      }

      const mainUser = await this.prisma.user.findUnique({
        where: {id: Number(userId)}
      })

      const user = await this.prisma.user.findUnique({
        where: {name: name }
      })
      if(user.id == userId){
        console.log("user.id === userId");
        throw new UnauthorizedException();
      }
      console.log(userId + " user.id==" + user.id + "name ===  " + name);
      if (mainUser.friendsList.includes(user.id)) {
        const updatedFriendList = mainUser.friendsList.filter((id) => id !== user.id);
        const userUpdate = await this.prisma.user.update({
          where: { id:  Number(userId)},
          data: {friendsList: updatedFriendList},
        })
      }
      const userUpdate = await this.prisma.user.update({
        where: { id:  Number(userId)},
        data: {blockList: user.blockList.push(user.id)}
      })
      console.log("BLOCKED ADDED: travail termine");
    }

    @Post('removeBlocked')
    async removeBlocked( @Req() request, @Body() body: {name: string}) {
      console.log("Removing blocked..." + body.name)
      const userId = request.cookies.id;
      if (!userId) {
        throw new UnauthorizedException();
      }
      console.log("id de l'user qui delete: " + userId)
      const { name } = body;
      if (!name) {
        throw new UnauthorizedException();
      }
      const user = await this.prisma.user.findUnique({
        where: {name: name }
      })
      console.log("id de l'user a delete: " + user.id)
      if (user.id == userId) {
        throw new UnauthorizedException();
      }
      const updatedBlockList = user.blockList.filter((id) => id !== user.id);
      console.log("updatedBlockList: " + updatedBlockList)
      

      const userUpdate = await this.prisma.user.update({
        where: { id: Number(userId) },
        data: {blockList: updatedBlockList},
        })
        console.log("BLOCKED REMOVED: travail termine");
      }



    @Post('removeFriend')
    async removeFriend( @Req() request, @Body() body: {name: string}) {
      console.log("Removing friend..." + body.name)
      const userId = request.cookies.id;
      if (!userId) {
        throw new UnauthorizedException();
      }
      console.log("id de l'user qui delete: " + userId)
      const { name } = body;
      if (!name) {
        throw new UnauthorizedException();
      }
      const user = await this.prisma.user.findUnique({
        where: {name: name }
      })
      console.log("id de l'user a delete: " + user.id)
      if (user.id == userId) {
        throw new UnauthorizedException();
      }
      const updatedFriendList = user.friendsList.filter((id) => id !== user.id);

      console.log("updatedFriendList: " + updatedFriendList)
        const userUpdate = await this.prisma.user.update({
        where: { id: Number(userId) },
        data: {friendsList: updatedFriendList},
        })
        console.log("FRIEND REMOVED: travail termine");
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


    @Post('searchUser')
    async searchByName(@Body() body: { name: string }, @Req() request: Request, @Res() response: Response) {
      try {
        const { name } = body;
        if (!name) {
          response.status(400).json({ error: 'Le nom est manquant' });
          return;
        }
        const user = await this.prisma.user.findUnique({
          where: {
            name: name,
          },
        });
        if (!user) {
          response.status(404).json({ error: 'Aucun utilisateur trouvé' });
          return;
        }
        const id = user.id;
        response.status(200).json({ id });
      } catch (error) {
        console.error('Erreur lors de la recherche d\'utilisateur :', error);
        response.status(500).json({ error: 'Erreur interne du serveur' });
      }
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

}
