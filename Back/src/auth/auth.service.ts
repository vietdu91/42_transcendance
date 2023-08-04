import { Injectable, Request, Query , HttpException, HttpStatus} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TwofaService } from 'src/twofa/twofa.service';
import { Response} from 'express';
import { authenticator } from 'otplib';
import { Prisma, User} from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
config();


const axios = require('axios'); // Axios est une librairie qui permet de faire des requêtes HTTP
const client_id = process.env.CLIENT_ID; // Remplacer par le client_id de votre application
const clientSecret = process.env.CLIENT_SECRET; // Remplacer par le client_secret de votre application
const urlRedirect = process.env.URL_REDIRECT; // Remplacer par l'URL de redirection de votre application


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
                private twofaService: TwofaService,
                private jwtService: JwtService,) {}

    async apiConnexion(userData: any, res: Response): Promise<User> {
        try
        {
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
              //res.json({user: user, accessToken: newToken});
              //res.redirect('http://localhost:3000/newprofile');
              return user;
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
                //res.redirect(process.env.URL_HOME_FRONT);
                return user;
            }
        }
        catch (error) {
            console.error(error);
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
            const response = await axios.post(process.env.URL_TOKEN42, { 
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
    