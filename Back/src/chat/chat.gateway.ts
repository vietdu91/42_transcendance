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
        //password: isPrivate ? password : null, // Stocker le mot de passe si la room est privée, sinon null
      };
    
      await this.prisma.channel.create({
        data: channelData,
      });
    
      // Émettre un événement pour informer que la room a été créée
      this.server.emit({ message: 'channelCreated', name });
    }

    
  @SubscribeMessage('joinRoom') // Écoutez l'événement 'joinRoom'
  async handleJoinRoom(@MessageBody() data: { name: string, userId: number }): Promise<void> {
    const { name, userId } = data;
  
    console.log(userId + ' joined ' + name);
    const chann = await this.prisma.channel.findUnique({
      where: {
        name: name // Assurez-vous que "name" est correctement défini
      }
    });

    const userIdNumber = parseInt(userId.toString());
    const updatedUsersList = [...chann.usersList, userIdNumber];
    try {
      await this.prisma.channel.update({
        where: { name: name },
        data: {
          usersList: updatedUsersList,
        },
      });
    }
    catch (e) {
      console.log(e);
    }
    this.server.to(name).emit('userJoined', { userId });
  }

  @SubscribeMessage('leaveRoom') // Écoutez l'événement 'leaveRoom'
  async handleLeaveRoom(@MessageBody() data: { name: string, userId: number }): Promise<void> {
    {
      const { name, userId } = data;
      console.log(userId + ' left ' + name);
      const chann = await this.prisma.channel.findUnique({
        where: {
          name: name // Assurez-vous que "name" est correctement défini
        }
      });

      const userIdNumber = parseInt(userId.toString());
      const updatedUsersList = chann.usersList.filter((id) => id !== userIdNumber);
      try {
        await this.prisma.channel.update({
          where: { name: name },
          data: {
            usersList: updatedUsersList,
          },
        });
      }
      catch (e) {
        console.log(e);
      }
      this.server.to(name).emit('userLeft', { userId });
    }
  }

  @SubscribeMessage('deleteRoom')
  async handleDeleteRoom(@MessageBody() data: { name: string }): Promise<void> {
    {
    const { name } = data;
  
    console.log('Deleted room with name:', name);
  
    // Avant de supprimer la room, vous pouvez rechercher son ID en fonction de son nom.
    const room = await this.prisma.channel.findUnique({
      where: { name: name },
    });
  
    if (room) {
      // Supprimez la room en utilisant son ID (si vous en avez un).
      await this.prisma.channel.delete({
        where: { id: room.id },
      });
  
      // Émettez un événement pour informer les clients que la room a été supprimée.
      this.server.emit('roomDeleted', { name });
    } else {
      // Gérer le cas où la room n'a pas été trouvée.
      console.log('Room not found:', name);
    }
  }
} 
}


