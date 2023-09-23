import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        })
    }  

    async validate(payload: {sub: number, username: string}) {
        const user = await this.prisma.user.findUnique({
            where: {id: payload.sub},
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
                    mutedList: true,
                    messages: true,
                  },
                },
              },
        })
        return user;
    }
}