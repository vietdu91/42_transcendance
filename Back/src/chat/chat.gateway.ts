import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors : '*'})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly prisma: PrismaService) {} // Injectez PrismaService via le constructeur

  @SubscribeMessage('sendMessageConv')
  async handleMessage(client: Socket, params: any): Promise<void> {
    const value = params.value;
    const userId = parseInt(String(params.userId));
    const convId = params.convId;
    const message = await this.prisma.message.create({
      data: {
        content: value,
        authorId: userId,
        conversationId: convId,
      }
    });

    const conv = await this.prisma.conversation.findUnique({
      where: {id: convId},
      include: {
        messages: true,
      }
    })

    client.emit('messageSent', {message: "message sent to conversation", value: value, messages: conv.messages});
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
      this.server.emit('channelCreated', { message: 'channelCreated', name });
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

    for (let i = 0; i < chann.usersList.length; i++) {
      if(chann.usersList[i] == userId){
        console.log(userId + ' is already in' + name);
        //this.server.emit('userBanned', { userId });
        return;
      }
    }
  
    for (let i = 0; i < chann.banList.length; i++) {
      if(chann.banList[i] == userId){
        console.log(userId + ' is banned from ' + name);
        //this.server.emit('userBanned', { userId });
        return;
      }
    }

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


  @SubscribeMessage('kickUser') // Écoutez l'événement 'kickUser'
  async handleKickUser(@MessageBody() data: { name: string, userId: number }): Promise<void> {
    const { name, userId } = data;
  
    console.log(userId + ' kicked from ' + name);
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
    this.server.to(name).emit('userKicked', { userId });
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
        console.log(e);  for (let i = 0; i < chann.banList.length; i++) {
      if(chann.banList[i] == userId){
        console.log(userId + ' is banned from ' + name);
        //this.server.emit('userBanned', { userId });
        return;
      }
    }
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

  @SubscribeMessage('banRoom')
  async handleBanRoom(@MessageBody() data: { name: string, userId: number}): Promise<void> {
    
    const { name, userId } = data;

    console.log('Banned user with id:', userId, 'from room:', name);

    const userIdNumber = parseInt(userId.toString());

    const chann = await this.prisma.channel.findUnique({
      where: {
        name: name // Assurez-vous que "name" est correctement défini
      }
    });

    const updatedUsersList = chann.usersList.filter((id) => id !== userIdNumber);
    const updatedBanList = [...chann.banList, userIdNumber];
    try {
      await this.prisma.channel.update({
        where: { name: name },
        data: {
         banList: updatedBanList,
          usersList: updatedUsersList,
        },
      });
    }
    catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('setAdmin')
  async handleSetAdmin(@MessageBody() data: { name: string, userId: number}): Promise<void> {
    
    const { name, userId } = data;

    console.log('Set admin with id:', userId, 'from room:', name);

    const userIdNumber = parseInt(userId.toString());

    const chann = await this.prisma.channel.findUnique({
      where: {
        name: name // Assurez-vous que "name" est correctement défini
      }
    });

    const updatedAdminList = [...chann.adminList, userIdNumber];
    try {
      await this.prisma.channel.update({
        where: { name: name },
        data: {
         adminList: updatedAdminList,
        },
      });
    }
    catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('unsetAdmin')
  async handleUnsetAdmin(@MessageBody() data: { name: string, userId: number}): Promise<void> {
    const { name, userId } = data;
    console.log('Unset admin with id:', userId, 'from room:', name);
    const userIdNumber = parseInt(userId.toString());
    const chann = await this.prisma.channel.findUnique({
      where: {
        name: name // Assurez-vous que "name" est correctement défini
      }
    });
    const updatedAdminList = chann.adminList.filter((id) => id !== userIdNumber);
    try {
      await this.prisma.channel.update({
        where: { name: name },
        data: {
         adminList: updatedAdminList,
        },
      });
    }
    catch (e) {
      console.log(e);
    }
  }


  @SubscribeMessage('createConversation')
  async handleCreateConversation(client: Socket, params: any): Promise<void> {
    const id = params.id;
    const otherName = params.otherName;
    const userId = parseInt(String(id));
    const user = await this.prisma.user.findUnique({
      where: {id: userId},
    });
    if (!user || user.name === otherName)
      return ;
    const otherUser = await this.prisma.user.findUnique({
      where: {name: otherName},
    });
    if (!otherUser || otherUser.id === id) {
      return ; 
    };
    // verifier que l'id existe dans la bdd 
    const convs = await this.prisma.conversation.findMany();
    for (let i = 0; i < convs.length; i++) {
      if ((user.name === convs[i].names[0] && otherName === convs[i].names[1]) || (user.name === convs[i].names[1] && otherName === convs[i].names[0])) {
        return ;
      }
    }
    const conversation = await this.prisma.conversation.create({
      data: {
        users: {
          connect: [
            {id: userId},
            {id: otherUser.id},
          ]
        },
        usersID: [userId, otherUser.id],
        names: [user.name, otherName],
      }
    });
    const shortUser = {
      name: otherName,
      nickname: otherUser.nickname,
      pfp: otherUser.pfp_url,
      // state: otherUser.state,
    }
    client.emit('conversationCreated', {message: "CA MARCHE", otherUser: shortUser, conversation: conversation});
  }


  // @SubscribeMessage('messageToRoom') // Écoutez l'événement 'messageToRoom'
  // async handleMessageToRoom(@MessageBody() data: { name: string, message: string, userId: number }): Promise<void> {
  //   const { name, message, userId } = data;
  
  //   console.log(userId + ' sent ' + message + ' to ' + name);
  
  //   // Vous pouvez maintenant utiliser les valeurs `name`, `message` et `userId` pour créer le message en conséquence.
  //   const messageData = {
  //     content: message,
  //     authorId: userId,
  //   };
  
  //   await this.prisma.message.create({
  //     data: messageData,
  //   });
  
  //   // Émettre un événement pour informer que le message a été envoyé.
  //   this.server.to(name).emit('message', { message, userId });
  // }

}


