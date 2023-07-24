import { Controller, Post, UseGuards, Req, Res, Query, Headers, Get, Redirect, Body, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from '../game/game.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { TwofaService } from '../twofa/twofa.service';

@Controller('Game')
export class GameController {
  constructor(
	  private readonly gameService: GameService,
	  private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly twofaService: TwofaService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('getGameById')
  async getGameById(@Query('roomId') roomId: number, @Req() request: Request, @Res() response: Response) {
    const room = await this.gameService.getGameById(roomId);
    if (!room) {
      throw new UnauthorizedException();
    }
    response.json({
      id: room.id,
      score: room.score,
      characters: room.characters,
    });
  }

}