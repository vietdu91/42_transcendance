import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Game, Prisma } from '@prisma/client';
import { authenticator } from 'otplib';
import { HttpException, HttpStatus } from '@nestjs/common';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async createUser(userData: any, nickname: string): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          nickname: nickname,
          state: 'ONLINE',
          age: 18,
          twoFactorSecret: authenticator.generateSecret(),
          accessToken: userData.accessToken,
          pfp_url: userData.pfp,
        }
      });
      return user;
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.delete({
        where: { id: id }
      });
      return user;
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getLeaderboard() {
    try {
      const users = await this.prisma.user.findMany();
      return users.map(user => {
        return {
          name: user.name,
          pfp: user.pfp_url,
          winrate: user.wins + user.looses === 0 ? 0 : Math.round(user.wins / (user.wins + user.looses) * 100),
        }
      });
    }
    catch {
      throw new UnauthorizedException();
    }
  }

  async getUserByName(username: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { name: username },
      });
      return user;
    } catch {
      throw new UnauthorizedException();
    }
  }

  async getUserById(userId: number): Promise<any | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(userId.toString()) },
        include: {
          conversations: {
            include: {
              messages: true,
            }
          },
          channels: {
            include: {
              usersList: true,
              banList: true,
              adminList: true,
              messages: true,
            },
          },
        },
      });
      return user;
    } catch {
      throw new UnauthorizedException();
    }
  }

  async getGamesByUserId(userId: number) {
    try {
      const games = await this.prisma.game.findMany({
        where: { players: { some: { id: parseInt(userId.toString()) } } },
      });
      return games.map(game => {
        return {
          names: game.playersName,
          score: game.score,
          date: game.date,
        }
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    try {
      return this.prisma.user.update({
        where: { id: userId },
        data: { twoFactorSecret: secret },
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  async turnOnTwoFactorAuthentication(userId: number): Promise<User> {
    try {
      return this.prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true },
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  async turnOffTwoFactorAuthentication(userId: number): Promise<User> {
    try {
      return this.prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: false },
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  async verifyUserId(id: number): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        }
      });
      return Boolean(user);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return this.prisma.user.findUnique({
        where: { email },
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  async getFriendsList(ids: number[]) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          id: { in: ids },
        },
      })
      return users;
    } catch {
      throw new UnauthorizedException();
    }
  }

}
