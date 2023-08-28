import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({ cors : '*'})
export class ChatGateway {
  @WebSocketServer()
  server: any;

  constructor(private readonly prisma: PrismaService) {} // Injectez PrismaService via le constructeur

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: string): Promise<void> {
    await this.prisma.message.create({
      data: {
        content: message[0],
        authorId: parseInt(message[1]),
      },
    });

    this.server.emit('message', message[0]);
    }

  @SubscribeMessage('channelName')
  async handleCreateChannel(@MessageBody() name: string): Promise<void> {
    console.log(name + ' channel created');
    await this.prisma.channel.create({
      data: {
        name: name[0],
        ownerId: name[1],
      },
    });
    this.server.emit({message: 'channelCreated', name: name});
  }

  // @SubscribeMessage('joinRoom') // Écoutez l'événement 'joinRoom'
  // async handleJoinRoom(@MessageBody() data: { roomName: string, userId: number }): Promise<void> {
  //   const { roomName, userId } = data;

  //   // Ici, vous pouvez implémenter la logique pour gérer la jointure de l'utilisateur à la room.
  //   // Par exemple, ajouter l'utilisateur à une liste de participants à la room, etc.

  //   // Vous pouvez également émettre un événement pour informer les autres utilisateurs que quelqu'un a rejoint la room.
  //   // Par exemple :
  //   this.server.to(roomName).emit('userJoined', { userId });

  //   // Vous pouvez également stocker les informations de la room et des utilisateurs dans votre base de données Prisma.

  //   // Assurez-vous d'adapter ce code à votre logique d'adhésion à la room et de gestion des utilisateurs.
  // }

  // Méthodes OnGatewayConnection et OnGatewayDisconnect pour gérer les connexions et les déconnexions des utilisateurs
  //handleConnection(client: Socket) {
    // Gérer la connexion d'un utilisateur
  //}

  //handleDisconnect(client: Socket) {
    // Gérer la déconnexion d'un utilisateur
  //}
}

