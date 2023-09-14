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
	nameLeft: string;
	nameRight: string;
	posLeft: number;
	posRight: number;
	wLeft: number;
	hLeft: number;
	wRight: number;
	hRight: number;
	usedPowLeft: boolean;
	usedPowRight: boolean;
	isPowLeft: boolean;
	isPowRight: boolean;
	tocLeft: number;
	tocRight: number;
	ball: Ball;
	gaveUp: Boolean;
}

@WebSocketGateway()
export class MatchmakingGateway {
	@WebSocketServer()
	server: Server;

	private queue: Player[] = [];

	private games: Game[] = [];

	private lTocSpeed: number = (9/16) * 100 / 160;
	private rTocSpeed: number = (9/16) * 100 / 160;

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
		// if (this.queue.length >= 1) {
			const player1 = this.queue.shift();
			const player2 = this.queue.shift();
			const prisma = new PrismaService();
			const date = new Date();

			const game = await prisma.game.create({
				data: {
					players: {
						connect: [
							{id: player1.user.id},
							{id: player2.user.id}, // change player1 to player2
						]
					},
					playersId: [player1.user.id, player2.user.id], // change player1 n2 to player2
					playersName: [player1.user.name, player2.user.name], // change player1 n2 to player2
					score: [0, 0],
					characters: [player1.user.character, player2.user.character], // change player1 n2 to player2
					playing: true,
					date: date,
				}
			});
		
			let newGame: Game = {
				gameId: game.id,
				isActive: true,
				idLeft: game.playersId[0],
				idRight: game.playersId[1],
				sockLeft: player1.id,
				sockRight: player2.id, //change to player2
				scoreLeft: 0,
				scoreRight: 0,
				charLeft: game.characters[0],
				charRight: game.characters[1],
				posLeft: (9/16) * 100 / 2,
				posRight: (9/16) * 100 / 2,
				nameLeft: game.playersName[0],
				nameRight: game.playersName[1],
				wLeft: 100 / 75,
				hLeft: (9/16) * 100 / 5,
				wRight: 100 / 75,
				hRight: (9/16) * 100 / 5,
				usedPowLeft: false,
				usedPowRight: false,
				isPowLeft: false,
				isPowRight: false,
				tocLeft: null,
				tocRight: null,
				ball: {
					x: 100 / 2,
					y: (9/16) * 100 / 2,
					rad: (9/16) * 100 / 75,
					speed: (9/16) * 100 / 125,
					inertia: 0,
					vx: 0,
					vy: 0,
				},
				gaveUp: false,
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

			await prisma.user.update({
				where: {id: game.playersId[0]},
				data: {
					actualGame: game.id,
					state: 'INGAME',
				},
			})
			await prisma.user.update({
				where: {id: game.playersId[1]},
				data: {
					actualGame: game.id,
					state: 'INGAME',
				},
			})

			this.server.to(player1.id).emit('matchFound', { roomId: game.id, opponent: player2.user }); // change player1 to player2
			this.server.to(player2.id).emit('matchFound', { roomId: game.id, opponent: player1.user });
		}
	}

	@SubscribeMessage('roundStart')
	async handleGameStart(socket: Socket, roomId: number): Promise<void> {
		const actualGame:Game = this.games[roomId];
		if (actualGame == null)
			return;
		
		actualGame.isPowLeft = actualGame.isPowRight = false;
		actualGame.tocLeft = actualGame.tocRight = null;
		
		actualGame.hLeft = (9/16) * 100 / 5;
		actualGame.hRight = (9/16) * 100 / 5;
			
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

	@SubscribeMessage('giveUp')
	async handleGiveUp(socket: Socket, params: number): Promise<void> {
		const actualGame:Game = this.games[params[0]];
		if (actualGame == null)
			return;
		const prisma = new PrismaService();

		if (actualGame.gaveUp)
			return ;

		const winnerId:number = params[1] === actualGame.idLeft ? actualGame.idRight : actualGame.idLeft;
		
		actualGame.isActive = false;

		const score = winnerId === actualGame.idLeft ? [5, 0] : [0, 5];

		const game = await prisma.game.update({
			where: {id: actualGame.gameId},
			data: {
				score: score,
				winnerId: winnerId,
				playing: false,
			}
		});
		
		if (winnerId === game.playersId[0]) {
			await prisma.user.update({
				where: {id: game.playersId[0]},
				data: {
					actualGame: null,
					wins: {increment: 1},
					state: 'ONLINE',
				},
			})
			await prisma.user.update({
				where: {id: game.playersId[1]},
				data: {
					actualGame: null,
					looses: {increment: 1},
					state: 'ONLINE',
				},
			})
		}
		else if (winnerId === game.playersId[1]) {
			await prisma.user.update({
				where: {id: game.playersId[0]},
				data: {
					actualGame: null,
					looses: {increment: 1},
					state: 'ONLINE',
				},
			})
			await prisma.user.update({
				where: {id: game.playersId[1]},
				data: {
					actualGame: null,
					wins: {increment: 1},
					state: 'ONLINE',
				},
			})
		}

		actualGame.gaveUp = true;
		const sendTo:string = winnerId === actualGame.idLeft ? actualGame.sockLeft : actualGame.sockRight;

		this.server.to(sendTo).emit("gaveUp", {message: "The other player gave up ! Boooo !", id: params[1]});
	}

	@SubscribeMessage('movePlayer')
	async handleMovePlayer(socket: Socket, params: number): Promise<void> {
		const actualGame:Game = this.games[params[0]];
		if (actualGame == null)
			return;

		const speed:number = (9/16) * 100 / 80;

		if (params[1] === actualGame.idLeft) {
			params[2] === 1 ? actualGame.posLeft -= speed : actualGame.posLeft += speed;
			if (actualGame.posLeft < (9/16) * 100 / 150)
				actualGame.posLeft = (9/16) * 100 / 150;
			else if (actualGame.posLeft > (9/16) * 100 - ((9/16) * 100 / 150) - (actualGame.hLeft))
				actualGame.posLeft = (9/16) * 100 - ((9/16) * 100 / 150) - (actualGame.hLeft);
		}
		if (params[1] === actualGame.idRight) {
			params[2] === 1 ? actualGame.posRight -= speed : actualGame.posRight += speed;
			if (actualGame.posRight < (9/16) * 100 / 150)
				actualGame.posRight = (9/16) * 100 / 150;
			else if (actualGame.posRight > (9/16) * 100 - ((9/16) * 100 / 150) - (actualGame.hRight))
				actualGame.posRight = (9/16) * 100 - ((9/16) * 100 / 150) - (actualGame.hRight);
		}
		this.server.to(actualGame.sockLeft).emit("playerMoved", {message: "The player has been moved", posLeft: actualGame.posLeft, posRight: actualGame.posRight});
		this.server.to(actualGame.sockRight).emit("playerMoved", {message: "The player has been moved", posLeft: actualGame.posLeft, posRight: actualGame.posRight});
	}
	
	@SubscribeMessage('usePower')
	async handleUsePower(socket: Socket, params: number): Promise<void> {
		const actualGame:Game = this.games[params[0]];
		if (actualGame == null)
			return;
		let char:string;

		if (actualGame.idLeft === params[1] && !actualGame.usedPowLeft) {
			switch (actualGame.charLeft) {
				case "Cartman": actualGame.hLeft = (9/16) * 100 / 2; break;
				case "Servietsky": ; break;
				case "Kenny": ; break;
				case "Timmy": ; break;
				case "TerrancePhilip": actualGame.ball.inertia = 0.6; break;
				case "Garrison": actualGame.tocLeft = (9/16) * 100 / 2; break;
				case "Henrietta": actualGame.scoreRight--; break;
				case "Butters": ; break;
			}
			char = actualGame.charLeft;
			actualGame.usedPowLeft = actualGame.isPowLeft = true;
		}
		else if (actualGame.idRight === params[1] && !actualGame.usedPowRight) {
			switch (actualGame.charRight) {
				case "Cartman": actualGame.hRight = (9/16) * 100 / 2; break;
				case "Servietsky": ; break;
				case "Kenny": ; break;
				case "Timmy": ; break;
				case "TerrancePhilip": actualGame.ball.inertia = 0.6; break;
				case "Garrison": actualGame.tocRight = (9/16) * 100 / 2; break;
				case "Henrietta": actualGame.scoreLeft--; break;
				case "Butters": ; break;
			}
			char = actualGame.charRight;
			actualGame.usedPowRight = actualGame.isPowRight = true;
		}
		else
			return ;
		this.server.to(actualGame.sockLeft).emit("usedPower", {message: "Power by : " + char, id: params[1], char: char, game: actualGame});
		this.server.to(actualGame.sockRight).emit("usedPower", {message: "Power by : " + char, id: params[1], char: char, game: actualGame});
	}

	@SubscribeMessage('moveBall')
	async handleMoveBall(socket: Socket, roomId: number) : Promise<void> {
		const actualGame:Game = this.games[roomId];
		if (actualGame == null)
			return;

		actualGame.ball.x += actualGame.ball.vx;
		actualGame.ball.y += actualGame.ball.vy;
		if (actualGame.ball.y + actualGame.ball.rad >= (9/16) * 100 || actualGame.ball.y - actualGame.ball.rad <= 0)
			actualGame.ball.vy *= -1;
		if (actualGame.ball.y <= 0)
			actualGame.ball.y = actualGame.ball.rad * 2;
		if (actualGame.ball.y >= 100)
			actualGame.ball.y = 100 - actualGame.ball.rad * 2;
		
		// MONSIEUR TOC START
		if (actualGame.tocLeft != null) {
			actualGame.tocLeft -= this.lTocSpeed;
			if (actualGame.tocLeft < (9/16) * 100 / 150) {
				this.lTocSpeed *= -1;
				actualGame.tocLeft = (9/16) * 100 / 150;
			}
			else if (actualGame.tocLeft > (9/16) * 100 - ((9/16) * 100 / 150) - (actualGame.hLeft / 2)) {
				this.lTocSpeed *= -1;
				actualGame.tocLeft = (9/16) * 100 - ((9/16) * 100 / 150) - (actualGame.hLeft / 2);
			}
		}
		if (actualGame.tocRight != null) {
			actualGame.tocRight -= this.rTocSpeed;
			if (actualGame.tocRight < (9/16) * 100 / 150) {
				this.rTocSpeed *= -1;
				actualGame.tocRight = (9/16) * 100 / 150;
			}
			else if (actualGame.tocRight > (9/16) * 100 - ((9/16) * 100 / 150) - (actualGame.hLeft / 2)) {
				this.rTocSpeed *= -1;
				actualGame.tocRight = (9/16) * 100 - ((9/16) * 100 / 150) - (actualGame.hLeft / 2);
			}
		}
		// MONSIEUR TOC STOP

		this.ballHit(actualGame);

		let kenny:boolean = false;
		if (actualGame.ball.x > 100 + actualGame.ball.rad || actualGame.ball.x < -actualGame.ball.rad) {
			if ((actualGame.charRight != "Kenny" || !actualGame.isPowRight) && actualGame.ball.x > 100 + actualGame.ball.rad)
				actualGame.scoreLeft++;
			else if ((actualGame.charLeft != "Kenny" || !actualGame.isPowLeft) && actualGame.ball.x < -actualGame.ball.rad)
				actualGame.scoreRight++;
			else if (actualGame.charLeft == "Kenny" && actualGame.isPowLeft || actualGame.charRight == "Kenny" && actualGame.isPowRight) { //Kenny Power
				kenny = true;
				if (actualGame.ball.x > 100 + actualGame.ball.rad && actualGame.charRight == "Kenny" && actualGame.isPowRight 
				|| actualGame.ball.x < -actualGame.ball.rad && actualGame.charLeft == "Kenny" && actualGame.isPowLeft) {
					actualGame.ball.vx *= -1;
					actualGame.ball.vy *= -1;
				}
			}
			if (!kenny) {
				this.games[roomId] = {
					...actualGame,
					scoreLeft: actualGame.scoreLeft,
					scoreRight: actualGame.scoreRight,
					posLeft: (9/16) * 100 / 2 - ((9/16) * 100 / 5) / 2,
					posRight: (9/16) * 100 / 2 - ((9/16) * 100 / 5) / 2,
					ball: {
						x: 100 / 2,
						y: (9/16) * 100 / 2,
						rad: (9/16) * 100 / 75,
						speed: (9/16) * 100 / 125,
						inertia: 0,
						vx: 0,
						vy: 0,
					}
				}
				if (actualGame.scoreLeft >= 5 || actualGame.scoreRight >= 5) {
					const prisma = new PrismaService();
					let winnerId:number;
	
					if (actualGame.scoreLeft >= 5)
						winnerId = actualGame.idLeft;
					else
						winnerId = actualGame.idRight;
					
					actualGame.isActive = false;
	
					const game = await prisma.game.update({
						where: {id: actualGame.gameId},
						data: {
							score: [actualGame.scoreLeft, actualGame.scoreRight],
							winnerId: winnerId,
							playing: false,
						}
					});

					if (winnerId === game.playersId[0]) {
						await prisma.user.update({
							where: {id: game.playersId[0]},
							data: {
								actualGame: null,
								wins: {increment: 1},
								state: 'ONLINE',
							},
						})
						await prisma.user.update({
							where: {id: game.playersId[1]},
							data: {
								actualGame: null,
								looses: {increment: 1},
								state: 'ONLINE',
							},
						})
					}
					else if (winnerId === game.playersId[1]) {
						await prisma.user.update({
							where: {id: game.playersId[0]},
							data: {
								actualGame: null,
								looses: {increment: 1},
								state: 'ONLINE',
							},
						})
						await prisma.user.update({
							where: {id: game.playersId[1]},
							data: {
								actualGame: null,
								wins: {increment: 1},
								state: 'ONLINE',
							},
						})
					}
					this.server.to(actualGame.sockLeft).emit("endGame", {message: "Game Over !! Winner : " + winnerId, winnerId: winnerId});
					this.server.to(actualGame.sockRight).emit("endGame", {message: "Game Over !! Winner : " + winnerId, winnerId: winnerId});
				}
				this.server.to(actualGame.sockLeft).emit("newPoint", {message: "Goal !! New point ! " + actualGame.scoreLeft + " - " + actualGame.scoreRight});
				this.server.to(actualGame.sockRight).emit("newPoint", {message: "Goal !! New point ! " + actualGame.scoreLeft + " - " + actualGame.scoreRight});
			}
		}
		this.server.to(actualGame.sockLeft).emit("ballMoved", {message: "The ball moved", game: actualGame, ballX: actualGame.ball.x, ballY: actualGame.ball.y, vx: actualGame.ball.vx, vy: actualGame.ball.vy, speed: actualGame.ball.speed + actualGame.ball.inertia});
		this.server.to(actualGame.sockRight).emit("ballMoved", {message: "The ball moved", game: actualGame, ballX: actualGame.ball.x, ballY: actualGame.ball.y, vx: actualGame.ball.vx, vy: actualGame.ball.vy, speed: actualGame.ball.speed + actualGame.ball.inertia});
	}

	private async ballHit(actualGame: Game) {
		const ball:Ball = actualGame.ball;

		if (((100 / 75) - ball.rad) < ball.x && ball.x < (100 / 75) + (100 / 75) + ball.rad) {
			if ((actualGame.posLeft - ball.rad) < ball.y && ball.y < (actualGame.posLeft + (actualGame.hLeft) + ball.rad)) {

				let centerX:number = 100 / 75 + (100 / 75) / 2;
				let centerY:number = actualGame.posLeft + (actualGame.hLeft) / 2;
			
				actualGame.ball.vx = actualGame.ball.x - centerX;
				actualGame.ball.vy = actualGame.ball.y - centerY;
				let magnitude:number = Math.sqrt(actualGame.ball.vx ** 2 + actualGame.ball.vy ** 2);
				if (magnitude > 10) {
					actualGame.ball.vx = actualGame.ball.vx * 10 / magnitude;
					actualGame.ball.vy = actualGame.ball.vy * 10 / magnitude;
				}
				let angle:number = Math.atan2(actualGame.ball.vy, actualGame.ball.vx);
				if (actualGame.ball.inertia < 0.4)
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
			if ((actualGame.posRight - ball.rad) <= ball.y && ball.y <= (actualGame.posRight + (actualGame.hRight) + ball.rad)) {

				let centerX:number = (100 - ((100 / 75) * 2)) + (100 / 75) / 2;
				let centerY:number = actualGame.posRight + (actualGame.hRight) / 2;
			
				actualGame.ball.vx = actualGame.ball.x - centerX;
				actualGame.ball.vy = actualGame.ball.y - centerY;
				let magnitude:number = Math.sqrt(actualGame.ball.vx ** 2 + actualGame.ball.vy ** 2);
				if (magnitude > 10) { //p5.vector.limit
					actualGame.ball.vx = actualGame.ball.vx * 10 / magnitude;
					actualGame.ball.vy = actualGame.ball.vy * 10 / magnitude;
				}
				let angle:number = Math.atan2(actualGame.ball.vy, actualGame.ball.vx); //heading
				if (actualGame.ball.inertia < 0.4)
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

		if (actualGame.tocLeft != null) {
			if (((100 / 75 * 4) - ball.rad) < ball.x && ball.x < (100 / 75 * 4) + (100 / 75) + ball.rad) {
				if ((actualGame.tocLeft - ball.rad) < ball.y && ball.y < (actualGame.tocLeft + (actualGame.hLeft / 2) + ball.rad)) {
	
					let centerX:number = (100 / 75 * 4) + (100 / 75) / 2;
					let centerY:number = actualGame.tocLeft + (actualGame.hLeft / 2) / 2;
				
					actualGame.ball.vx = actualGame.ball.x - centerX;
					actualGame.ball.vy = actualGame.ball.y - centerY;
					let magnitude:number = Math.sqrt(actualGame.ball.vx ** 2 + actualGame.ball.vy ** 2);
					if (magnitude > 10) {
						actualGame.ball.vx = actualGame.ball.vx * 10 / magnitude;
						actualGame.ball.vy = actualGame.ball.vy * 10 / magnitude;
					}
					let angle:number = Math.atan2(actualGame.ball.vy, actualGame.ball.vx);
					if (actualGame.ball.inertia < 0.4)
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
		}
		if (actualGame.tocRight != null) {
			if (((100 - ((100 / 75) * 5)) - ball.rad) <= ball.x && ball.x <= (100 - ((100 / 75) * 5)) + (100 / 75) + ball.rad) {
				if ((actualGame.tocRight - ball.rad) <= ball.y && ball.y <= (actualGame.tocRight + (actualGame.hRight / 2) + ball.rad)) {
	
					let centerX:number = (100 - ((100 / 75) * 5)) + (100 / 75) / 2;
					let centerY:number = actualGame.tocRight + (actualGame.hRight) / 2 / 2;
				
					actualGame.ball.vx = actualGame.ball.x - centerX;
					actualGame.ball.vy = actualGame.ball.y - centerY;
					let magnitude:number = Math.sqrt(actualGame.ball.vx ** 2 + actualGame.ball.vy ** 2);
					if (magnitude > 10) { //p5.vector.limit
						actualGame.ball.vx = actualGame.ball.vx * 10 / magnitude;
						actualGame.ball.vy = actualGame.ball.vy * 10 / magnitude;
					}
					let angle:number = Math.atan2(actualGame.ball.vy, actualGame.ball.vx); //heading
					if (actualGame.ball.inertia < 0.4)
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
}
