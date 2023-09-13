import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Game, Prisma } from '@prisma/client';
import { authenticator } from 'otplib';
import { HttpException, HttpStatus } from '@nestjs/common';

 
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(userData: any): Promise<User> {
    try {
        const user = await this.prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                nickname: userData.name,
                age: 18,
                twoFactorSecret: authenticator.generateSecret(),
                accessToken: userData.accessToken,
                pfp_url: userData.pfp,
            }
        });
        console.log('User created');
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
        console.log('User deleted');
        return user;
    } catch (error) {
        console.error(error);
        throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

  async getLeaderboard() {
    const users = await this.prisma.user.findMany();
    return users.map(user => {
      return {
        name: user.name,
        pfp: user.pfp_url,
        winrate: user.wins + user.looses === 0 ? 0 : Math.round(user.wins / (user.wins + user.looses) * 100),
      }
    });
  }

  async getUserByName(username: string): Promise<User | null> {
    console.log(username);
    const user = await this.prisma.user.findUnique({
      where: {name: username},
    });
    return user;
  }

  async getUserById(userId: number): Promise<User | null> {
    const user: User = await this.prisma.user.findUnique({
      where: { id: parseInt(userId.toString()) },
    });
    return user;
  }

  async getGamesByUserId(userId: number) {
    const games = await this.prisma.game.findMany({
      where: {players: {some: {id: parseInt(userId.toString())}}},
    });
    return games.map(game => {
      return {
        names: game.playersName,
        score: game.score,
        date: game.date,
      }
    });
  }
  
  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret }
    });
  }

  async turnOnTwoFactorAuthentication(userId: number): Promise<User> {
    console.log("turnOnTwoFa for " + userId);
    return this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true }
    });
  }

  async turnOffTwoFactorAuthentication(userId: number): Promise<User> {
    console.log("turnOffTwoFa for " + userId);
    return this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false }
    });
  }

  async verifyUserId(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id
      }
    });
    console.log(Boolean(user));
    return Boolean(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
        where: { email },
    });
  }

}
