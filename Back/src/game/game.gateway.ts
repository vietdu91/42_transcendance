import { HttpException, HttpStatus } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { subscribe } from 'diagnostics_channel';

interface Player {
	id: string;
	user: User;
}

@WebSocketGateway()
export class MatchmakingGateway {
	@WebSocketServer()
	server: Server;

	private queue: Player[] = [];

	@SubscribeMessage('joinQueue')
	async handleJoinQueue(client: Socket, userId: number): Promise<void> {
		const userService = new UserService(new PrismaService());
		const user = await userService.getUserById(userId);

		for (let players of this.queue) {
			if (players.user.id === userId) {
				client.emit('alreadyJoined', { message: 'You already joined the matchmaking' });
				return ;
			}
		}

		const player: Player = {
			id: client.id,
			user,
		}

		this.queue.push(player);
		
		client.emit('queueJoined', { success: true, message: 'Joined matchmaking queue' });
		this.createMatch();
	}

	@SubscribeMessage('leaveQueue')
	async handleLeaveQueue(client: Socket, userId: number): Promise<void> {
    	this.queue = this.queue.filter((player) => {
			player.user.id !== userId;
		});
	}

	private async createMatch(): Promise<void> {
		if (this.queue.length >= 2) {

			const player1 = this.queue.shift();
			const player2 = this.queue.shift();

			const prisma = new PrismaService();

			const date = new Date();

			console.log(date);

			const game = await prisma.game.create({
				data: {
					players: {
						connect: [
							{id: player1.user.id},
							{id: player2.user.id},
						]
					},
					score: [0, 0],
					characters: [player1.user.character, player2.user.character],
					date: date,
				}
			});

			console.log(game);

			this.server.to(player1.id).emit('matchFound', { roomId: game.id, opponent: player2.user });
			this.server.to(player2.id).emit('matchFound', { roomId: game.id, opponent: player1.user });
		}
	}
}

interface Game {
	socketId: string;
	gameId: number;
	idLeft: number;
	idRight: number;
	scoreLeft: number;
	scoreRight: number;
	charLeft: string;
	charRight: string;
	posLeft: number;
	posRight: number;
	ballX: number;
	ballY: number;
}

@WebSocketGateway()
export class GameGateway {
	@WebSocketServer()
	server: Server;

	private game: Game = {
		socketId: '',
		gameId: 0,
		idLeft: 0,
		idRight: 0,
		scoreLeft: 0,
		scoreRight: 0,
		charLeft: '',
		charRight: '',
		posLeft: 0,
		posRight: 0,
		ballX: 0,
		ballY: 0,
	}

	@SubscribeMessage('gameStart')
	async handleGameStart(socket: Socket, gameId, idLeft, idRight, charLeft, charRight): Promise<void> {
		
		this.game.gameId = gameId;
		this.game.idLeft = idLeft;
		this.game.idRight = idRight;
		this.game.charLeft = charLeft;
		this.game.charRight = charRight;

		socket.emit('gameStarted', { success: true, message: 'The game started' });
	}

	@SubscribeMessage('movePaddle')
	async handleMovePaddle(socket: Socket, player: string, nb: number): Promise<void> {
		if (player === 'left')
			this.game.posLeft += nb;
		else
			this.game.posRight += nb;
		socket.emit('paddleMoved', {success: true, message: 'The ' + player + ' paddle moved'});
	}

	@SubscribeMessage('moveBall')
	async handleMoveBall(socket: Socket, x: number, y: number): Promise<void> {
		this.game.ballX = x;
		this.game.ballY = y;
		socket.emit('ballMoved', {success: true, message: 'The ball moved'})
	}

	@SubscribeMessage('playerScored')
	async handlePlayerScored(socket: Socket, player: string): Promise<void> {
		if (player === 'left')
			this.game.scoreLeft++;
		else
			this.game.scoreRight++;
		this.resetPos();
		socket.emit('scoreUpdated', {success: true, message: player + '\'s player score updated'})
	}

	private async resetPos(): Promise<void> {
		this.game.posLeft = 0;
		this.game.posRight = 0;
		this.game.ballX = 0;
		this.game.ballY = 0;
	}
}