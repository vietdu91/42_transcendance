import { Injectable, Request, Query, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { Prisma, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { TwofaController } from 'src/twofa/twofa.controller';
import { TwofaService } from 'src/twofa/twofa.service';
import { serialize } from 'cookie'
config();


const axios = require('axios');
const client_id = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const urlRedirect = process.env.URL_REDIRECT;

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwtService: JwtService,
        private userService: UserService,
        private twoFaService: TwofaService) { }

    async apiConnexion(userData: any, token: string, res: Response): Promise<User> {
        try {
            let user: User;
            user = await this.userService.findUserByEmail(userData.email);
            if (!user) {
                res.redirect(`` + process.env.URL_LOCAL_F + `/setNickname?token=${token}`);
            }
            else {
                if (user.twoFactorEnabled) {
                    res.redirect(`` + process.env.URL_LOCAL_F + `/2fa?id=${user.id}`);
                }
                else {
                    await this.prisma.user.update({
                        where: { id: user.id },
                        data: { state: 'ONLINE' },
                    })
                    const newToken = await this.generateAndSetAccessToken(user);
                    res.cookie("accessToken", newToken);
                    res.redirect(process.env.URL_LOCAL_F);
                }
            }
            return user;
        } catch {
            throw new UnauthorizedException();
        }
    }

    async connexionPostNickname(token: string, nickname: string, res: Response) {
        const userData = await this.getUserData(token);
        const user = await this.userService.createUser(userData, nickname);
        const newToken = await this.generateAndSetAccessToken(user);
        res.cookie("accessToken", newToken);
        res.status(200).json({ message: 'Connexion réussie' });
    }

    async apiConnexion2fa(user: User, res: Response): Promise<void> {
        try {
            if (!user)
                throw new UnauthorizedException("user doesn't exist");
            else {
                const newToken = await this.generateAndSetAccessToken(user);
                res.cookie("accessToken", newToken);
            }
        } catch {
            throw new UnauthorizedException();
        }
    }

    async generateAndSetAccessToken(user: User): Promise<string> {
        try {
            const jwtPayload = { username: user.name, sub: user.id };
            const newToken = this.jwtService.sign(jwtPayload);
            return newToken;
        } catch {
            throw new UnauthorizedException();
        }
    }

    async getAccessToken(code: string): Promise<any> {
        try {
            const response = await axios.post(process.env.URL_42TOKEN, {
                client_id: client_id,
                client_secret: clientSecret,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: urlRedirect,
            });
            const accessToken = response.data.access_token;
            return accessToken;
        } catch {
            throw new HttpException('Failed to retrieve access token', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserData(accessToken: string): Promise<any> {
        try {
            const userResponse = await axios.get(process.env.URL_42ME, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            return {
                id: userResponse.data.id,
                name: userResponse.data.login,
                email: userResponse.data.email,
                code: userResponse.data.code,
                pfp: userResponse.data.image.link,
            };
        } catch {
            throw new HttpException('Failed to retrieve user data', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
