import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import { authenticator } from 'otplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwofaService {
  constructor (
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}
    
  public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
    console.log("isTwoFactorAuthenticationCodeValid = " + twoFactorAuthenticationCode);
    console.log("isTwoFactorSecret = " + user.twoFactorSecret);
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorSecret
    })
  }

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret(); 
    console.log("generateTwoFactorAuthenticationSecret = " + secret)
    const otpauthUrl = authenticator.keyuri(user.email, this.configService.get('APP_NAME'), secret);
    await this.prismaService.user.update({
       where: { id: user.id },
       data: { twoFactorSecret: secret },
     });
    return {
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }
}