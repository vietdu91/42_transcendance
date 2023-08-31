import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game, Prisma } from '@prisma/client';
 
@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService
  ) {}

  async getGameById(roomId: number): Promise<Game | null> {
    const room = await this.prisma.game.findUnique({
      where: { 
        id: parseInt(roomId.toString()),
      }
    });
    return room;
  }

  async getLastGameActive(): Promise<Game | null> {
    const count = await this.prisma.game.count();
    let room;
    for (let i:number = 1; i <= count; i++) {
      const newroom = await this.prisma.game.findUnique({
        where: {
          id: i
        }
      })
      if (newroom.playing)
        room = newroom;
    }
    return room;
  }

}
