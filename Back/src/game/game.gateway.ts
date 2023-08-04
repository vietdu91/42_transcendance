import { HttpException, HttpStatus } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
// import { subscribe } from 'diagnostics_channel';
import p5 from 'p5';

let PI = Math.PI;

interface Player {
	id: string;
	user: User;
}

@WebSocketGateway({namespace: 'matchmaking'})
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
					playersId: [player1.user.id, player2.user.id],
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

interface Ball {
	x: number;
	y: number;
	rad: number;
	speed: number;
	vx: number;
	vy: number;
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
	ball: Ball;
}

@WebSocketGateway({namespace: 'game'})
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
		ball: {
			x: 100 / 2,
			y: (9/16) * 100 / 2,
			rad: (9/16) * 100 / 75,
			speed: 100 / 150,
			vx: 0,
			vy: 0,
		},
	}

	@SubscribeMessage('roundStart')
	async handleGameStart(socket: Socket, params: any): Promise<void> {
		this.game.gameId = params[0];
		this.game.idLeft = params[1];
		this.game.idRight = params[2];
		this.game.charLeft = params[3];
		this.game.charRight = params[4];

        let angle = Math.floor(Math.random() * ((3*PI/3) - (PI/3) + 1) + (PI/3));

		this.game.ball.vx = this.game.ball.speed * Math.cos(angle);
		if (Math.random() < 0.5) {
			this.game.ball.vx *= -1;
		}
		this.game.ball.vy = this.game.ball.speed * Math.sin(angle);
		if (Math.random() < 0.5) {
            this.game.ball.vy *= -1;
        }
		socket.emit('roundStarted', { success: true, message: 'The round started with ' + this.game.ball, ball: this.game.ball});
	}

	@SubscribeMessage('leaveGame')
	async handleLeaveGame(socket: Socket, params: number): Promise<void> {
		const prisma = new PrismaService();
		const gameUpdate = await prisma.game.update({
			where: { id: params[0] },
			data: {
				winnerId: params[1],
				score: [params[2], params[3]],
			},
		});
		this.reset();
		socket.emit('gameLeaved', { success: true, message: 'The game is over', isWinner: params[4] });
	}

	@SubscribeMessage('movePaddle')
	async handleMovePaddle(socket: Socket, params: any): Promise<void> {
		if (params[0] === 'left') {
			this.game.posLeft += params[1];
			console.log(this.game.posLeft);
		}
		else {
			this.game.posRight += params[1];
			console.log(this.game.posRight);
		}
		socket.emit('paddleMoved', {success: true, message: 'The ' + params[0] + ' paddle moved'});
	}

	@SubscribeMessage('moveBall')
	async handleMoveBall(socket: Socket, params: number): Promise<void> {
		this.game.ball.x += this.game.ball.vx;
		this.game.ball.y += this.game.ball.vy;
		if (this.game.ball.y + this.game.ball.rad >= 100 || this.game.ball.y - this.game.ball.rad <= 0) {
			this.game.ball.vy *= -1;
		}
		socket.emit('ballMoved', {success: true, message: 'The ball moved'})
	}

	@SubscribeMessage('setBall')
	async setBall(socket: Socket, params: number): Promise<void> {
		socket.emit('ballSet', {success: true, message: 'The ball has been set', backBall: this.game.ball})
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

	private async reset(): Promise<void> {
		this.game.socketId = '';
		this.game.gameId = 0;
		this.game.idLeft = 0;
		this.game.idRight = 0;
		this.game.scoreLeft = 0;
		this.game.scoreRight = 0;
		this.game.charLeft = '';
		this.game.charRight = '';
		this.resetPos();
	}

	private async resetPos(): Promise<void> {
		this.game.posLeft = 0;
		this.game.posRight = 0;
		// this.game.ball.pos = p5.createVector(100 / 2, (9/16) * 100 / 2);
	}
}