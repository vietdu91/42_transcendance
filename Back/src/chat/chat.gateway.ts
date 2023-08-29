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
    async handleCreateChannel(@MessageBody() data: { name: string, ownerId: string, isPrivate?: boolean, password?: string }): Promise<void> {
      const { name, ownerId, isPrivate, password } = data;
    
      console.log(name + ' channel created');
    
      // Vous pouvez maintenant utiliser les valeurs `name`, `ownerId`, `isPrivate` et `password` pour créer la room en conséquence.
      
      const channelData = {
        name,
        ownerId,
        isPrivate: !!isPrivate, // Convertir en booléen
        password: isPrivate ? password : null, // Stocker le mot de passe si la room est privée, sinon null
      };
    
      await this.prisma.channel.create({
        data: channelData,
      });
    
      // Émettre un événement pour informer que la room a été créée
      this.server.emit({ message: 'channelCreated', name });
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

