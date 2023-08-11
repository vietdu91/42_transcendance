import { Injectable, Request, Query , HttpException, HttpStatus} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Response} from 'express';
import { UserService } from '../user/user.service';
import { Prisma, User} from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
config();


const axios = require('axios'); // Axios est une librairie qui permet de faire des requêtes HTTP
const client_id = process.env.CLIENT_ID; // Remplacer par le client_id de votre application
const clientSecret = process.env.CLIENT_SECRET; // Remplacer par le client_secret de votre application
const urlRedirect = process.env.URL_REDIRECT; // Remplacer par l'url de redirection de votre application

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
                private jwtService: JwtService,
                private userService: UserService) {}

    async apiConnexion(userData: any, res: Response): Promise<User> {
        try {
            let user: User;
            // Vérifier si l'utilisateur existe déjà
            user = await this.findUserByEmail(userData.email);
            if (!user) {
                user = await this.userService.createUser(userData);
                const newToken = await this.generateAndSetAccessToken(user);
                this.setAuthCookies(res, newToken, user.id);
                res.redirect("http://localhost:3000/newprofile");
                return user;
            }
            else { 
                const newToken = await this.generateAndSetAccessToken(user);
                this.setAuthCookies(res, newToken, user.id);
                res.redirect("http://localhost:3000");
                return user;
            }
        }catch (error) {
            console.error("error = " + error);
            }
        }
            
    private async findUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
        
            
    private async generateAndSetAccessToken(user: User): Promise<string> {
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
    }
            
    async getUserToken(id: number): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { id: parseInt(id.toString()) },
        });
        return user.accessToken;
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
            };
        } catch (error) {
            console.error(error);
            throw new HttpException('Failed to retrieve user data', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
    