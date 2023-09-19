import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game, Prisma } from '@prisma/client';
 
@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService
  ) {}

  async getGameById(roomId: number): Promise<Game | null> {
    try {
      const room = await this.prisma.game.findUnique({
        where: { 
          id: parseInt(roomId.toString()),
        }
      });
      return room;
    } catch {
      throw new UnauthorizedException();
    }
  }

}
