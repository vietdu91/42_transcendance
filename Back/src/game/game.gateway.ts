import { HttpException, HttpStatus } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {v4} from 'uuid';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
// import { subscribe } from 'diagnostics_channel';
import p5 from 'p5';

let PI = Math.PI;

type Player = {
	id: string;
	user: User;
}

type Ball = {
	x: number;
	y: number;
	rad: number;
	speed: number;
	inertia: number;
	vx: number;
	vy: number;
}

type Game = {
	gameId: number;
	isActive: boolean;
	idLeft: number;
	idRight: number;
	sockLeft: string;
	sockRight: string;
	scoreLeft: number;
	scoreRight: number;
	charLeft: string;
	charRight: string;
	posLeft: number;
	posRight: number;
	ball: Ball;
}

@WebSocketGateway()
export class MatchmakingGateway {
	@WebSocketServer()
	server: Server;

	private queue: Player[] = [];

	private games: Game[] = [];

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
		// if (this.queue.length >= 2) {
		if (this.queue.length >= 1) {

			const player1 = this.queue.shift();
			// const player2 = this.queue.shift();

			const prisma = new PrismaService();

			const date = new Date();

			const game = await prisma.game.create({
				data: {
					players: {
						connect: [
							{id: player1.user.id},
							{id: player1.user.id}, // change player1 to player2
						]
					},
					playersId: [player1.user.id, player1.user.id], // change player1 n2 to player2
					score: [0, 0],
					characters: [player1.user.character, player1.user.character], // change player1 n2 to player2
					date: date,
				}
			});
		
			let newGame: Game = {
				gameId: game.id,
				isActive: true,
				idLeft: game.playersId[0],
				idRight: game.playersId[1],
				sockLeft: player1.id,
				sockRight: player1.id, //change to player2
				scoreLeft: 0,
				scoreRight: 0,
				charLeft: game.characters[0],
				charRight: game.characters[1],
				posLeft: (9/16) * 100 / 2,
				posRight: (9/16) * 100 / 2,
				ball: {
					x: 100 / 2,
					y: (9/16) * 100 / 2,
					rad: (9/16) * 100 / 75,
					speed: (9/16) * 100 / 150,
					inertia: 0,
					vx: 0,
					vy: 0,
				}
			}

			const gameIdIndex = game.id;

			if (gameIdIndex >= this.games.length) {
				this.games.length = gameIdIndex + 1;
			}
		
			for (let i = 0; i < gameIdIndex; i++) {
				if (this.games[i] === undefined) {
					this.games[i] = null;
				}
			}

			this.games[gameIdIndex] = newGame;

			this.server.to(player1.id).emit('matchFound', { roomId: game.id, opponent: player1.user }); // change player1 to player2
			// this.server.to(player2.id).emit('matchFound', { roomId: game.id, opponent: player1.user });
		}
	}

	@SubscribeMessage('roundStart')
	async handleGameStart(socket: Socket, roomId: number): Promise<void> {
		const actualGame:Game = this.games[roomId];

        let angle = Math.floor(Math.random() * ((3*PI/3) - (PI/3) + 1) + (PI/3));

		actualGame.ball.vx = actualGame.ball.speed * Math.cos(angle);
		if (Math.random() < 0.5) {
			actualGame.ball.vx *= -1;
		}
		actualGame.ball.vy = actualGame.ball.speed * Math.sin(angle);
		if (Math.random() < 0.5) {
            actualGame.ball.vy *= -1;
        }
		socket.emit('roundStarted', { success: true, message: 'The round started with ' + actualGame.ball.vx + "vx, " + actualGame.ball.vy + "vy", game: actualGame, ball: actualGame.ball});
	}

	@SubscribeMessage('movePlayer')
	async handleMovePlayer(socket: Socket, params: number): Promise<void> {
		const actualGame:Game = this.games[params[0]];

		const speed:number = (9/16) * 100 / 80;

		if (params[1] === actualGame.idLeft) {
			params[2] === 1 ? actualGame.posLeft -= speed : actualGame.posLeft += speed;
			if (actualGame.posLeft < (9/16) * 100 / 150)
				actualGame.posLeft = (9/16) * 100 / 150;
			else if (actualGame.posLeft > (9/16) * 100 - ((9/16) * 100 / 150) - ((9/16) * 100 / 5))
				actualGame.posLeft = (9/16) * 100 - ((9/16) * 100 / 150) - ((9/16) * 100 / 5);
		}
		if (params[1] === actualGame.idRight) {
			params[2] === 1 ? actualGame.posRight -= speed : actualGame.posRight += speed;
			if (actualGame.posRight < (9/16) * 100 / 150)
				actualGame.posRight = (9/16) * 100 / 150;
			else if (actualGame.posRight > (9/16) * 100 - ((9/16) * 100 / 150) - ((9/16) * 100 / 5))
				actualGame.posRight = (9/16) * 100 - ((9/16) * 100 / 150) - ((9/16) * 100 / 5);
		}

		this.server.to(actualGame.sockLeft).emit("playerMoved", {message: "The player has been moved", posLeft: actualGame.posLeft, posRight: actualGame.posRight});
		this.server.to(actualGame.sockRight).emit("playerMoved", {message: "The player has been moved", posLeft: actualGame.posLeft, posRight: actualGame.posRight});
	}

	@SubscribeMessage('moveBall')
	async handleMoveBall(socket: Socket, roomId: number) : Promise<void> {
		const actualGame:Game = this.games[roomId];

		actualGame.ball.x += actualGame.ball.vx;
		actualGame.ball.y += actualGame.ball.vy;
		if (actualGame.ball.y + actualGame.ball.rad >= (9/16) * 100 || actualGame.ball.y - actualGame.ball.rad <= 0)
			actualGame.ball.vy *= -1;
		
		this.ballHit(actualGame);

		if (actualGame.ball.x > 100 + actualGame.ball.rad || actualGame.ball.x < -actualGame.ball.rad) {
			if (actualGame.ball.x > 100 + actualGame.ball.rad)
				actualGame.scoreLeft++;
			else
				actualGame.scoreRight++;
			this.games[roomId] = {
				...actualGame,
				scoreLeft: actualGame.scoreLeft,
				scoreRight: actualGame.scoreRight,
				posLeft: (9/16) * 100 / 2,
				posRight: (9/16) * 100 / 2,
				ball: {
					x: 100 / 2,
					y: (9/16) * 100 / 2,
					rad: (9/16) * 100 / 75,
					speed: (9/16) * 100 / 150,
					inertia: 0,
					vx: 0,
					vy: 0,
				}
			}
			if (actualGame.scoreLeft >= 2 || actualGame.scoreRight >= 2) {
				const prisma = new PrismaService();
				let winnerId:number;
				
				if (actualGame.scoreLeft >= 2)
					winnerId = actualGame.idLeft;
				else
					winnerId = actualGame.idRight;
				
				actualGame.isActive = false;

				const game = await prisma.game.update({
					where: {id: actualGame.gameId},
					data: {
						score: [actualGame.scoreLeft, actualGame.scoreRight],
						winnerId: winnerId,
					}
				});

				this.server.to(actualGame.sockLeft).emit("endGame", {message: "Game Over !! Winner : " + winnerId, winnerId: winnerId});
				this.server.to(actualGame.sockRight).emit("endGame", {message: "Game Over !! Winner : " + winnerId, winnerId: winnerId});
			}
			this.server.to(actualGame.sockLeft).emit("newPoint", {message: "Goal !! New point ! " + actualGame.scoreLeft + " - " + actualGame.scoreRight});
			this.server.to(actualGame.sockRight).emit("newPoint", {message: "Goal !! New point ! " + actualGame.scoreLeft + " - " + actualGame.scoreRight});
		}

		this.server.to(actualGame.sockLeft).emit("ballMoved", {message: "The ball moved", ballX: actualGame.ball.x, ballY: actualGame.ball.y, vx: actualGame.ball.vx, vy: actualGame.ball.vy, speed: actualGame.ball.speed + actualGame.ball.inertia});
		this.server.to(actualGame.sockRight).emit("ballMoved", {message: "The ball moved", ballX: actualGame.ball.x, ballY: actualGame.ball.y, vx: actualGame.ball.vx, vy: actualGame.ball.vy, speed: actualGame.ball.speed + actualGame.ball.inertia});
	}

	private async ballHit(actualGame: Game) {
		const ball:Ball = actualGame.ball;

		if (((100 / 75) - ball.rad) < ball.x && ball.x < (100 / 75) + (100 / 75) + ball.rad) {
			if ((actualGame.posLeft - ball.rad) < ball.y && ball.y < (actualGame.posLeft + ((9/16) * 100 / 5) + ball.rad)) {

				let centerX:number = 100 / 75 + (100 / 75) / 2;
				let centerY:number = actualGame.posLeft + ((9/16) * 100 / 5) / 2;
			
				actualGame.ball.vx = actualGame.ball.x - centerX;
				actualGame.ball.vy = actualGame.ball.y - centerY;
				let magnitude:number = Math.sqrt(actualGame.ball.vx ** 2 + actualGame.ball.vy ** 2);
				if (magnitude > 10) {
					actualGame.ball.vx = actualGame.ball.vx * 10 / magnitude;
					actualGame.ball.vy = actualGame.ball.vy * 10 / magnitude;
				}
				let angle:number = Math.atan2(actualGame.ball.vy, actualGame.ball.vx);
				if (actualGame.ball.inertia < 4)
					actualGame.ball.inertia += (9 / 16) * 0.1;
				if (angle > -(PI/2) && angle < (PI/2)) {
					actualGame.ball.vx = Math.cos(angle / 2) * (actualGame.ball.speed + actualGame.ball.inertia);
					actualGame.ball.vy = Math.sin(angle / 2) * (actualGame.ball.speed + actualGame.ball.inertia);
				} else {
					const x:number = actualGame.ball.vx;
					const y:number = actualGame.ball.vy;
					actualGame.ball.vx = x * Math.cos(PI) - y * Math.sin(PI);
					actualGame.ball.vy = x * Math.sin(PI) + y * Math.cos(PI);
					let angle:number = Math.atan2(actualGame.ball.vy, actualGame.ball.vx);
					actualGame.ball.vx = Math.cos(PI + angle / 2) * (actualGame.ball.speed + actualGame.ball.inertia);
					actualGame.ball.vy = Math.sin(PI + angle / 2) * (actualGame.ball.speed + actualGame.ball.inertia);
				}
			}
		}

		if (((100 - ((100 / 75) * 2)) - ball.rad) <= ball.x && ball.x <= (100 - ((100 / 75) * 2)) + (100 / 75) + ball.rad) {
			if ((actualGame.posRight - ball.rad) <= ball.y && ball.y <= (actualGame.posRight + ((9/16) * 100 / 5) + ball.rad)) {

				let centerX:number = (100 - ((100 / 75) * 2)) + (100 / 75) / 2;
				let centerY:number = actualGame.posRight + ((9/16) * 100 / 5) / 2;
			
				actualGame.ball.vx = actualGame.ball.x - centerX;
				actualGame.ball.vy = actualGame.ball.y - centerY;
				let magnitude:number = Math.sqrt(actualGame.ball.vx ** 2 + actualGame.ball.vy ** 2);
				if (magnitude > 10) { //limit
					actualGame.ball.vx = actualGame.ball.vx * 10 / magnitude;
					actualGame.ball.vy = actualGame.ball.vy * 10 / magnitude;
				}
				let angle:number = Math.atan2(actualGame.ball.vy, actualGame.ball.vx); //heading
				if (actualGame.ball.inertia < 4)
					actualGame.ball.inertia += (9 / 16) * 0.1;
				if (angle > -PI/2 && angle < PI/2) {
					actualGame.ball.vx = Math.cos(angle / 2) * (actualGame.ball.speed + actualGame.ball.inertia);
					actualGame.ball.vy = Math.sin(angle / 2) * (actualGame.ball.speed + actualGame.ball.inertia);
				} else {
					const x:number = actualGame.ball.vx;
					const y:number = actualGame.ball.vy;
					actualGame.ball.vx = x * Math.cos(PI) - y * Math.sin(PI);
					actualGame.ball.vy = x * Math.sin(PI) + y * Math.cos(PI);
					let angle:number = Math.atan2(actualGame.ball.vy, actualGame.ball.vx);
					actualGame.ball.vx = Math.cos(PI + angle / 2) * (actualGame.ball.speed + actualGame.ball.inertia);
					actualGame.ball.vy = Math.sin(PI + angle / 2) * (actualGame.ball.speed + actualGame.ball.inertia);
				}
			}
		}
	}
}



// @WebSocketGateway({namespace: 'game'})
// export class GameGateway {
// 	@WebSocketServer()
// 	server: Server;

// 	private game: Game = {
// 		socketId: '',
// 		gameId: 0,
// 		idLeft: 0,
// 		idRight: 0,
// 		scoreLeft: 0,
// 		scoreRight: 0,
// 		charLeft: '',
// 		charRight: '',
// 		posLeft: 0,
// 		posRight: 0,
// 		ball: {
// 			x: 100 / 2,
// 			y: (9/16) * 100 / 2,
// 			rad: (9/16) * 100 / 75,
// 			speed: 100 / 150,
// 			vx: 0,
// 			vy: 0,
// 		},
// 	}

// 	@SubscribeMessage('leaveGame')
// 	async handleLeaveGame(socket: Socket, params: number): Promise<void> {
// 		const prisma = new PrismaService();
// 		const gameUpdate = await prisma.game.update({
// 			where: { id: params[0] },
// 			data: {
// 				winnerId: params[1],
// 				score: [params[2], params[3]],
// 			},
// 		});
// 		this.reset();
// 		socket.emit('gameLeaved', { success: true, message: 'The game is over', isWinner: params[4] });
// 	}

// 	@SubscribeMessage('movePaddle')
// 	async handleMovePaddle(socket: Socket, params: any): Promise<void> {
// 		if (params[0] === 'left') {
// 			this.game.posLeft += params[1];
// 			console.log(this.game.posLeft);
// 		}
// 		else {
// 			this.game.posRight += params[1];
// 			console.log(this.game.posRight);
// 		}
// 		socket.emit('paddleMoved', {success: true, message: 'The ' + params[0] + ' paddle moved'});
// 	}

// 	@SubscribeMessage('moveBall')
// 	async handleMoveBall(socket: Socket, params: number): Promise<void> {
// 		this.game.ball.x += this.game.ball.vx;
// 		this.game.ball.y += this.game.ball.vy;
// 		if (this.game.ball.y + this.game.ball.rad >= 100 || this.game.ball.y - this.game.ball.rad <= 0) {
// 			this.game.ball.vy *= -1;
// 		}
// 		socket.emit('ballMoved', {success: true, message: 'The ball moved'})
// 	}

// 	@SubscribeMessage('setBall')
// 	async setBall(socket: Socket, params: number): Promise<void> {
// 		socket.emit('ballSet', {success: true, message: 'The ball has been set', backBall: this.game.ball})
// 	}

// 	@SubscribeMessage('playerScored')
// 	async handlePlayerScored(socket: Socket, player: string): Promise<void> {
// 		if (player === 'left')
// 			this.game.scoreLeft++;
// 		else
// 			this.game.scoreRight++;
// 		this.resetPos();
// 		socket.emit('scoreUpdated', {success: true, message: player + '\'s player score updated'})
// 	}

// 	private async reset(): Promise<void> {
// 		this.game.socketId = '';
// 		this.game.gameId = 0;
// 		this.game.idLeft = 0;
// 		this.game.idRight = 0;
// 		this.game.scoreLeft = 0;
// 		this.game.scoreRight = 0;
// 		this.game.charLeft = '';
// 		this.game.charRight = '';
// 		this.resetPos();
// 	}

// 	private async resetPos(): Promise<void> {
// 		this.game.posLeft = 0;
// 		this.game.posRight = 0;
// 		// this.game.ball.pos = p5.createVector(100 / 2, (9/16) * 100 / 2);
// 	}
// }