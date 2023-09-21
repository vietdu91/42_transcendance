import { Controller, Post, UseGuards, Req, Res, Query, Headers, Get, Redirect, Body, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ChatService } from '../chat/chat.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import JwtAuthenticationGuard from '../jwt-guard/jwt-guard.guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService,
	) { }

	@Get('getMessagesByConv')
	@UseGuards(JwtAuthenticationGuard)
	async getMessagesByConv(@GetUser() user: any, @Res() response: Response, @Query('id') id: number) {
		try {
			const conv = await this.prisma.conversation.findUnique({
				where: { id: Number(id) },
				include: {
					messages: true,
				}
			})
			let persoMessages = conv.messages.filter((index) => !(user.blockList.includes(index.authorId)));
			response.json({messages: persoMessages});
		} catch {
			throw new BadRequestException();
		}
	}

	@Get('getMessagesByChannel')
	@UseGuards(JwtAuthenticationGuard)
	async getMessagesByChannel(@GetUser() user: any, @Res() response: Response, @Query('id') id: number) {
		try {
			const channel = await this.prisma.channel.findUnique({
				where: { id: Number(id) },
				include: {
					messages: true,
				}
			})
			let persoMessages = channel.messages.filter((index) => !(user.blockList.includes(index.authorId)));
			response.json({messages: persoMessages});
		} catch {
			throw new BadRequestException();
		}
	}

}