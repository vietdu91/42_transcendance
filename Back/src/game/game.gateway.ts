import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

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
	handleLeaveQueue(client: Socket, userId: number): void {
		console.log("leaving");
    	this.queue = this.queue.filter((player) => {
			console.log(player.user.id + " " + userId);
			player.user.id !== userId
		});
	}

	private createMatch(): void {
		if (this.queue.length >= 2) {
			const player1 = this.queue.shift();
			const player2 = this.queue.shift();

			const gameRoomId:String = '${player1.id}-${player2.id}';
			
			this.server.to(player1.id).emit('matchFound', { roomId: gameRoomId, opponent: player2 });
			this.server.to(player2.id).emit('matchFound', { roomId: gameRoomId, opponent: player1 });
		}
	}
}