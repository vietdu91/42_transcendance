import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game, Prisma } from '@prisma/client';
 
@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService
  ) {}

  async getGameById(roomId: number): Promise<Game | null> {
    console.log('getGameById: roomId =', roomId);
    const room = await this.prisma.game.findUnique({
      where: { 
        id: parseInt(roomId.toString()),
      }
    });
    // console.log('getUserById: user =', user);
    return room;
  }

}
