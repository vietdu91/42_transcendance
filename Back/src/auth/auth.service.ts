import { Injectable, Request, Query , HttpException, HttpStatus} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TwofaService } from 'src/twofa/twofa.service';
import { Response} from 'express';
import { authenticator } from 'otplib';
import { Prisma, User} from '@prisma/client';
import { JwtService } from '@nestjs/jwt';


const axios = require('axios'); // Axios est une librairie qui permet de faire des requêtes HTTP
const client_id = "u-s4t2ud-0adef0effd9ace501b3d56f7e9eaf4c40bb9c552b2ea91ba35f745eeeb55b6b4"; // Remplacer par le client_id de votre application
const clientSecret = "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";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
                private twofaService: TwofaService,
                private jwtService: JwtService,) {}

    async apiConnexion(code: string, res: Response): Promise<any> {
        const accessToken = await this.getAccessToken(code);
        const userData = await this.getUserData(accessToken);
        var user = await this.prisma.user.findUnique({
            where: { email: userData.email },
        });
        if (!user ) {
            user = await this.createUser(userData);

            const payload = { username: user.name, sub: user.id };
            console.log("paylod = " + payload.sub + " " + payload.username);
            const newToken = this.jwtService.sign(payload);
            // JWT token use to get user data and validate user
            console.log("new token ==  " + newToken);
            await this.prisma.user.update({
                where: { id: user.id },
                data: { accessToken: newToken },
          });
          res.cookie('accessToken', newToken);
          res.cookie('id', user.id);
          res.redirect('http://localhost:3000/newprofile');
        }
        else {

            const payload = { username: user.name, sub: user.id };
            console.log("paylod = " + payload.sub + " " + payload.username);
            const newToken = this.jwtService.sign(payload);
            // JWT token use to get user data and validate user
            console.log("new token ==  " + newToken);
            await this.prisma.user.update({
                where: { id: user.id },
                data: { accessToken: newToken },
              });
              res.cookie('accessToken', newToken);
              res.cookie('id', user.id);
            res.redirect('http://localhost:3000');
        }
    }

    async getUserToken(id: number): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { id: parseInt(id.toString()) },
        });
        return user.accessToken;
    }


    async getAccessToken(code: string): Promise<any> {
        try {
            const response = await axios.post('https://api.intra.42.fr/oauth/token', { 
                client_id: client_id, 
                client_secret: clientSecret,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: "http://localhost:3001/Auth/conexion" 
            });
            const accessToken = response.data.access_token;
            console.log(accessToken + " == accessToken");
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

}
    