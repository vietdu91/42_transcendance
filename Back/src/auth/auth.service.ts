import { Injectable, Request, Query , HttpException, HttpStatus} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TwofaService } from 'src/twofa/twofa.service';
import { authenticator } from 'otplib';
import { Prisma, User} from '@prisma/client';
import { JwtService } from '@nestjs/jwt';


const axios = require('axios'); // Axios est une librairie qui permet de faire des requêtes HTTP
const client_id = "u-s4t2ud-0cce972308f0f6be06570a9ddeaacaf86d8d76148d7c2514184539f693b54491"; // Remplacer par le client_id de votre application
const clientSecret = "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";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
                private twofaService: TwofaService,
                private jwtService: JwtService,) {}

    async apiConnexion(code: string): Promise<User> {
        const accessToken = await this.getAccessToken(code);
        const userData = await this.getUserData(accessToken);
        const createdUser = await this.createUser(userData);
        const payload = { username: createdUser.name, sub: createdUser.id };
        console.log("paylod = " + payload);
        const newToken = this.jwtService.sign(payload);
            // JWT token use to get user data and validate user
        console.log("new token ==  " + newToken);
        await this.prisma.user.update({
            where: { id: createdUser.id },
            data: { accessToken: newToken },
          });
        return createdUser;
    }

    async getAccessToken(code: string): Promise<any> {
        try {
            const response = await axios.post('https://api.intra.42.fr/oauth/token', { 
                client_id: client_id, 
                client_secret: clientSecret,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: "http://localhost:3000/Auth/conexion" 
            });
            const accessToken = response.data.access_token;
            return accessToken;
        } catch (error) {
            console.error(error);
            throw new HttpException('Failed to retrieve access token', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getUserData(accessToken: string): Promise<any> {
        console.log(accessToken + " == accessToken");
        try {
            const userResponse = await axios.get('https://api.intra.42.fr/v2/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return {
                id: userResponse.data.id,
                name: userResponse.data.login,
                email: userResponse.data.email,
                code: userResponse.data.code,
                accessToken: null,
            };
        } catch (error) {
            console.error(error);
            throw new HttpException('Failed to retrieve user data', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
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

    async validateUser(username: string, pass: string): Promise<any> {
        return null;
    }

    async login(user: User) {
        console.log("login service");
        console.log(user);

        const payload = { username: user.name, sub: user.id };

        console.log(payload)
        console.log(this.jwtService.sign(payload))
        return {
            access_token: this.jwtService.sign(payload),
            // JWT token use to get user data and validate user
        };
    }
}
    