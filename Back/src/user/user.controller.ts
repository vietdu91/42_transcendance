import { Controller, Get, Post, UseGuards, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import JwtAuthenticationGuard from '../jwt-guard/jwt-guard.guard';



@Controller('profile')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService) { }

  @Get('getUserByName')
  @UseGuards(JwtAuthenticationGuard)
  async getUserByName(@Query('username') username: string, @Req() request: Request, @Res() response: Response) {
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
  @UseGuards(JwtAuthenticationGuard)
  async getUser(@Req() request: Request, @Res() response: Response) {
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
  @UseGuards(JwtAuthenticationGuard)
  async getLeaderboard(@Req() request: Request, @Res() response: Response) {
    const users = await this.userService.getLeaderboard();
    users.sort((a, b) => b.winrate - a.winrate);
    response.json({ users: users });
  }

    @Post('addFriend')
    @UseGuards(JwtAuthenticationGuard)
    async addFriend( @Req() request, @Body() body: {name: string, userId: string}, @Res() response: Response) {;
      console.log("On y arrive pour addFriend jusqu'ici ouuuuuu");
      const { name , userId} = body;

      if (!name) {
        throw new UnauthorizedException();
      }
      const user = await this.prisma.user.findUnique({
        where: {name: name }
      })

      const mainUser = await this.prisma.user.findUnique({
        where: {id: Number(user.id)}
      })
      if (mainUser.blockList.includes(parseInt(userId))) {
        console.log("t bloquer batar");
        throw new UnauthorizedException();
      }
      if(user.id == parseInt(userId)){
        console.log("user.id === userId");
        throw new UnauthorizedException();
      }
      const userUpdate = await this.prisma.user.update({
        where: { id:  Number(userId)},
        data: {friendsList: { push: user.id }},
      }) 
      console.log("FRIEND ADDED: travail termine");
    }

    @Post('addBlocked')
    @UseGuards(JwtAuthenticationGuard)
    async addBlocked( @Req() request, @Body() body: {name: string, userId:string}) {;
      console.log("On y arrive pour addBlocked jusqu'ici ouuuuuu");
      const { name, userId} = body;
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
      if(user.id == parseInt(userId)){
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
        await this.prisma.user.update({
        where: { id:  Number(userId)},
        data: {blockList: { push: user.id }},
      })
      console.log("BLOCKED ADDED: travail termine");
    }

    @Post('removeBlocked')
    @UseGuards(JwtAuthenticationGuard)
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
    @UseGuards(JwtAuthenticationGuard)
    async removeFriend( @Req() request, @Body() body: {name: string, userId: string}) {
      console.log("Removing friend..." + body.name)
      const { name , userId} = body;
      if (!name) {
        throw new UnauthorizedException();
      }
      const user = await this.prisma.user.findUnique({
        where: {name: name }
      })
      console.log("id de l'user a delete: " + user.id)
      if (user.id == parseInt(userId)) {
        throw new UnauthorizedException();
      }
      const updatedFriendList = user.friendsList.filter((id) => id !== user.id);

      console.log("updatedFriendList: " + updatedFriendList)
        const userUpdate = await this.prisma.user.update({
        where: { id: Number(userId) },
        data: { friendsList: updatedFriendList },
      })
    }

  @Patch('setNickname')
  @UseGuards(JwtAuthenticationGuard)
  async setNickname(@Req() request, @Body() body: { nickname: string }) {
    const userId = request.cookies.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const { nickname } = body;
    if (!nickname)
      throw new UnauthorizedException();
    const regex: RegExp = /^[a-zA-Z0-9\s\-\_]+$/;
    if (nickname.length < 2 || nickname.length > 20 || !regex.test(nickname))
      throw new UnauthorizedException();
    const userUpdate = await this.prisma.user.update({
      where: { id: Number(userId) },
      data: { nickname: nickname },
    });
    return { message: 'Surnom enregistré avec succès' };
  }

  @Patch('setAge')
  @UseGuards(JwtAuthenticationGuard)
  async setAge(@Req() request, @Body() body: { age: number }) {
    const userId = request.cookies.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const { age } = body;
    if (!age || age <= 0 || age > 100)
      throw new UnauthorizedException();
    const userUpdate = await this.prisma.user.update({
      where: { id: Number(userId) },
      data: { age: Number(age) },
    });
    return { message: 'Age enregistré avec succès' };
  }

  @Patch('setCharacter')
  @UseGuards(JwtAuthenticationGuard)
  async setCharacter(@Req() request, @Body() body: { character: string }) {
    const userId = request.cookies.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const { character } = body;
    if (character != "Cartman" && character != "Servietsy" && character != "Kenny" && character != "Timmy"
      && character != "TerrancePhilip" && character != "Garrison" && character != "Henrietta" && character != "Butters") {
      throw new UnauthorizedException();
    }
    const userUpdate = await this.prisma.user.update({
      where: { id: Number(userId) },
      data: { character: character },
    });
    return { message: 'Personnage modifié avec succès' };
  }

  @Get('getUserChat')
  async getUserChat(@Req() request: Request, @Res() response: Response) {
    const userId = request.cookies.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    
    response.json({
      id: user.id,
      name: user.name,
      nickname: user.nickname,
      age: user.age,
      pfp: user.pfp_url,
      friends: user.friendsList,
      blocks: user.blockList,
      conversations: user.conversations,
      channels: user.channels,
    })
  }


  @Post('searchUser')
  @UseGuards(JwtAuthenticationGuard)
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
      response.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }

  @Patch('disableTwoFA')
  @UseGuards(JwtAuthenticationGuard)
  async disableTwoFa(@Req() request: Request, @Body() body: { state: boolean }) {
    const userId = parseInt(request.cookies.id);
    if (!userId)
      throw new UnauthorizedException();
    this.userService.turnOffTwoFactorAuthentication(userId);
    return { message: 'Disabled 2FA' };
  }

  @Get('getUserChatById')
  async getUserChatById(@Query('id') id: number, @Req() request: Request, @Res() response: Response) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    response.json({
      name: user.name,
      nickname: user.nickname,
      pfp: user.pfp_url,
    });
  }

}
