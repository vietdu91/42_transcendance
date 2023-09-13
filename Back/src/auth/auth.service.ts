import { Injectable, Request, Query , HttpException, HttpStatus, UnauthorizedException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Response} from 'express';
import { UserService } from '../user/user.service';
import { Prisma, User} from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { TwofaController } from 'src/twofa/twofa.controller';
import { TwofaService } from 'src/twofa/twofa.service';
config();


const axios = require('axios'); // Axios est une librairie qui permet de faire des requêtes HTTP
const client_id = process.env.CLIENT_ID; // Remplacer par le client_id de votre application
const clientSecret = process.env.CLIENT_SECRET; // Remplacer par le client_secret de votre application
const urlRedirect = process.env.URL_REDIRECT; // Remplacer par l'url de redirection de votre application

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
                private jwtService: JwtService,
                private userService: UserService,
                private twoFaService: TwofaService) {}
    
    async apiConnexion(userData: any, res: Response): Promise<User> {
        try {
            let user: User;
            user = await this.userService.findUserByEmail(userData.email);
            if (!user) {
                user = await this.userService.createUser(userData);
                const newToken = await this.generateAndSetAccessToken(user);
                this.setAuthCookies(res, newToken, user.id);
                res.redirect(process.env.URL_LOCAL_F + "/newprofile");
            }
            else { 
                if (user.twoFactorEnabled) {
                    res.cookie('id', user.id);
                    res.redirect(process.env.URL_LOCAL_F + '/2fa');
                }
                else {
                    const newToken = await this.generateAndSetAccessToken(user);
                    this.setAuthCookies(res, newToken, user.id);
                    res.redirect(process.env.URL_LOCAL_F);
                }
            }
            return user;
        }catch (error) {
            console.error("error = " + error);
            }
        }
            
    async apiConnexion2fa(user: User, res: Response): Promise<void> {
        if (!user)
            throw new UnauthorizedException("user doesn't exist");
        else {
            const newToken = await this.generateAndSetAccessToken(user);
            this.setAuthCookies(res, newToken, user.id);
        }
    }
            
    async generateAndSetAccessToken(user: User): Promise<string> {
        const jwtPayload = { username: user.name, sub: user.id };
        const newToken = this.jwtService.sign(jwtPayload);

        await this.prisma.user.update({
            where: { id: user.id },
            data: { accessToken: newToken },
        });
        return newToken;
    }
            
    private setAuthCookies(res: Response, accessToken: string, userId: number): void {
        res.cookie('accessToken', accessToken);
        res.cookie('id', userId);
        console.log("jai vraiment set ");
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
        } catch (error) {
            console.error(error);
            throw new HttpException('Failed to retrieve access token', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getUserData(accessToken: string): Promise<any> {
        try {
            const userResponse = await axios.get(process.env.URL_42ME, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return {
                id: userResponse.data.id,
                name: userResponse.data.login,
                email: userResponse.data.email,
                code: userResponse.data.code,
                pfp: userResponse.data.image.link,
            };
        } catch (error) {
            console.error(error);
            throw new HttpException('Failed to retrieve user data', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
    