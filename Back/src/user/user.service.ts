import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
 
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
