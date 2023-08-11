import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
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
                twoFactorSecret: authenticator.generateSecret(),
                accessToken: userData.accessToken,
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

  findOne(id: string){
    const user = this.prisma.user.findUnique({
      where: {id: parseInt(id.toString())}
    });
    return user;
  }

  async getUserById(userId: number): Promise<User | null> {
     console.log('getUserById: userId =', userId);
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(userId.toString()) }
    });
    // console.log("Mon ID :" + userId);
    // console.log('getUserById: user =', user);
    return user;
  }
  
  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret }
    });
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    console.log("turnOnTwoFactorAuthentication = TRUE" + userId);
    return this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true }
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
}
