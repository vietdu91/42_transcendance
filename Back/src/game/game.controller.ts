import { Controller, Post, UseGuards, Req, Res, Query, Headers, Get, Redirect, Body, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { GameService } from '../game/game.service';

@Controller('Game')
export class GameController {
  constructor(
	  private readonly gameService: GameService,
  ) {}

  @Get('cookie')
  async getCookie(@Req() request: Request, @Res() response: Response) {

  }

  @Get('getGameById')
  async getGameById(@Query('roomId') roomId: number, @Req() request: Request, @Res() response: Response) {
    const room = await this.gameService.getGameById(roomId);
    if (!room) {
      throw new UnauthorizedException();
    }
    response.json({
      id: room.id,
      playersId: room.playersId,
      score: room.score,
      characters: room.characters,
    });
  }
  
}