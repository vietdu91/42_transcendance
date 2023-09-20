import { Controller, Get, Post, UseGuards, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import JwtAuthenticationGuard from '../jwt-guard/jwt-guard.guard';

@Controller('profile')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService) { }

  @Get('getUserByName')
  @UseGuards(JwtAuthenticationGuard)
  async getUserByName(@GetUser() user: any, @Query('username') username: string, @Res() response: Response) {
    try {
      const target = await this.userService.getUserByName(username);
      if (!target) {
        throw new UnauthorizedException();
      }

      let percentage: number = target.wins + target.looses === 0 ? 0 : Math.round(target.wins / (target.wins + target.looses) * 100);

      const games = await this.userService.getGamesByUserId(target.id);

      response.json({
        user: target,
        percentage: percentage,
        games: games,
        friend: user.friendsList.includes(target.id),
        blocked: user.blockList.includes(target.id),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Get('getUser')
  @UseGuards(JwtAuthenticationGuard)
  async getUser(@GetUser() user: User, @Res() response: Response) {
    try {
      let percentage: number = user.wins + user.looses === 0 ? 0 : Math.round(user.wins / (user.wins + user.looses) * 100);

      const games = await this.userService.getGamesByUserId(user.id);

      response.json({
        user: user,
        percentage: percentage,
        games: games,
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Get('getLeaderboard')
  @UseGuards(JwtAuthenticationGuard)
  async getLeaderboard(@Req() request: Request, @Res() response: Response) {
    try {
      const users = await this.userService.getLeaderboard();
      users.sort((a, b) => b.winrate - a.winrate);
      response.json({ users: users });
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Post('addFriend')
  @UseGuards(JwtAuthenticationGuard)
  async addFriend(@GetUser() user: any, @Res() res: Response, @Body() body: { name: string }) {
    try {
      const { name } = body;
      if (!name) {
        throw new UnauthorizedException();
      }
      const target = await this.prisma.user.findUnique({
        where: { name: name }
      })
      if (target.blockList.includes(user.id)) {
        throw new UnauthorizedException();
      }
      if (target.id == user.id) {
        throw new UnauthorizedException();
      }
      const userUpdate = await this.prisma.user.update({
        where: { id: user.id },
        data: { friendsList: { push: target.id } },
      })
      res.json({
        name: target.name,
      })
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Post('addBlocked')
  @UseGuards(JwtAuthenticationGuard)
  async addBlocked(@GetUser() user: any, @Body() body: { name: string }) {
    try {
      const { name } = body;
      if (!name) {
        throw new UnauthorizedException();
      }
      const target = await this.prisma.user.findUnique({
        where: { name: name }
      })
      if (target.id === user.id) {
        throw new UnauthorizedException();
      }
      if (target.friendsList.includes(user.id)) {
        const updatedFriendList = target.friendsList.filter((id) => id !== user.id);
        await this.prisma.user.update({
          where: { id: target.id },
          data: {
            friendsList: updatedFriendList,
          }
        })
      }
      let updatedFriendList = user.friendsList;
      if (user.friendsList.includes(target.id)) {
        updatedFriendList = user.friendsList.filter((id) => id !== target.id);
      }
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          friendsList: updatedFriendList,
          blockList: { push: target.id },
        },
      })
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Post('removeBlocked')
  @UseGuards(JwtAuthenticationGuard)
  async removeBlocked(@GetUser() user: any, @Body() body: { name: string }) {
    try {
      const { name } = body;
      if (!name) {
        throw new UnauthorizedException();
      }
      const target = await this.prisma.user.findUnique({
        where: { name: name }
      })
      if (target.id === user.id) {
        throw new UnauthorizedException();
      }
      const updatedBlockList = user.blockList.filter((id) => id !== target.id);
      const userUpdate = await this.prisma.user.update({
        where: { id: user.id },
        data: { blockList: updatedBlockList },
      })
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Post('removeFriend')
  @UseGuards(JwtAuthenticationGuard)
  async removeFriend(@GetUser() user: any, @Body() body: { name: string }) {
    try {
      const { name } = body;
      if (!name) {
        throw new UnauthorizedException();
      }
      const target = await this.prisma.user.findUnique({
        where: { name: name }
      })
      if (target.id === user.id) {
        throw new UnauthorizedException();
      }
      const updatedFriendList = user.friendsList.filter((id) => id !== target.id);

      const userUpdate = await this.prisma.user.update({
        where: { id: user.id },
        data: { friendsList: updatedFriendList },
      })
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Patch('setNickname')
  @UseGuards(JwtAuthenticationGuard)
  async setNickname(@GetUser() user: any, @Body() body: { nickname: string }) {
    try {
      const { nickname } = body;
      if (!nickname)
        throw new UnauthorizedException();
      const regex: RegExp = /^[a-zA-Z0-9\s\-\_]{2,20}$/;
      if (!regex.test(nickname))
        throw new UnauthorizedException();
      const userUpdate = await this.prisma.user.update({
        where: { id: user.id },
        data: { nickname: nickname },
      });
      return { message: 'Surnom enregistré avec succès' };
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Patch('setAge')
  @UseGuards(JwtAuthenticationGuard)
  async setAge(@GetUser() user: any, @Body() body: { age: number }) {
    try {
      const { age } = body;
      if (age <= 0 || age > 100)
        throw new UnauthorizedException();
      const userUpdate = await this.prisma.user.update({
        where: { id: user.id },
        data: { age: Number(age) },
      });
      return { message: 'Age enregistré avec succès' };
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Patch('setCharacter')
  @UseGuards(JwtAuthenticationGuard)
  async setCharacter(@GetUser() user: any, @Body() body: { character: string }) {
    try {
      const { character } = body;
      if (character != "Cartman" && character != "Servietsky" && character != "Kenny" && character != "Timmy"
        && character != "TerrancePhilip" && character != "Garrison" && character != "Henrietta" && character != "Butters")
        throw new UnauthorizedException();
      const userUpdate = await this.prisma.user.update({
        where: { id: user.id },
        data: { character: character },
      });
      if (!userUpdate)
        return { message: 'Personnage modifié avec succès' };
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Get('getUserChat')
  @UseGuards(JwtAuthenticationGuard)
  async getUserChat(@GetUser() user: any, @Res() response: Response) {
    try {
      const friends = await this.userService.getFriendsList(user.friendsList);
      response.json({
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        age: user.age,
        pfp: user.pfp_url,
        friends: friends,
        blocks: user.blockList,
        conversations: user.conversations,
        channels: user.channels,
      })
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Patch('disableTwoFA')
  @UseGuards(JwtAuthenticationGuard)
  async disableTwoFa(@GetUser() user: any, @Body() body: { state: boolean }) {
    try {
      this.userService.turnOffTwoFactorAuthentication(user.id);
      return { message: 'Disabled 2FA' };
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Get('getUserChatById')
  @UseGuards(JwtAuthenticationGuard)
  async getUserChatById(@GetUser() user: any, @Res() response: Response, @Query('ids') ids: number[]) {
    try {
      const id = (user.id == ids[0] ? ids[1] : ids[0]);
      const target = await this.userService.getUserById(id);
      if (!target) {
        throw new UnauthorizedException();
      }
      response.json({
        name: target.name,
        nickname: target.nickname,
        pfp: target.pfp_url,
        state: target.state,
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Get('getBlocked')
  @UseGuards(JwtAuthenticationGuard)
  async getBlocked(@GetUser() user: any, @Res() response: Response) {
    try {
      response.json({ blocked: user.blockList });
    } catch (error) {
      throw error;
    }
  }
}
