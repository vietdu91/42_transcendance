import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { Server, Socket } from 'socket.io';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

type UserChat = {
  id: string;
  user: User;
}

@WebSocketGateway({ cors: '*' })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private users: UserChat[] = [];

  constructor(private readonly prisma: PrismaService) { } // Injectez PrismaService via le constructeur

  @SubscribeMessage('joinChat')
  async handleJoinChat(client: Socket, params: any): Promise<void> {
    const userId = parseInt(String(params.userId));
    const userService = new UserService(new PrismaService());
    const user = await userService.getUserById(userId);

    for (let user of this.users) {
      if (user.user.id === userId) {
        return;
      }
    }

    const userChat: UserChat = {
      id: client.id,
      user,
    }

    this.users.push(userChat);

    client.emit('chatJoined', { message: 'Joined Chat' });
  }

  @SubscribeMessage('sendMessageConv')
  async handleMessageConv(client: Socket, params: any): Promise<void> {
    const value = params.value;
    const userId = parseInt(String(params.userId));
    const convId = params.convId;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    });
    const message = await this.prisma.message.create({
      data: {
        content: value,
        authorId: userId,
        authorName: user.name,
        conversationId: convId,
      }
    });

    const conv = await this.prisma.conversation.findUnique({
      where: { id: convId },
      include: {
        messages: true,
        users: true,
      }
    })
    for (let user of conv.users) {
      for (let userChat of this.users) {
        if (user.id === userChat.user.id) {
          this.server.to(userChat.id).emit('messageSentConv', { message: "message sent to conversation", value: value, messages: conv.messages });
        }
      }
    }
  }

  @SubscribeMessage('sendMessageChann')
  async handleMessageChann(client: Socket, params: any): Promise<void> {
    const value = params.value;
    const userId = parseInt(String(params.userId));
    const channId = params.channId;
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    });
    const message = await this.prisma.message.create({
      data: {
        content: value,
        authorId: userId,
        authorName: user.name,
        channelId: channId,
      }
    });

    const chann = await this.prisma.channel.findUnique({
      where: { id: channId },
      include: {
        messages: true,
        usersList: true,
      }
    })
    for (let user of chann.usersList) {
      for (let userChat of this.users) {
        if (user.id === userChat.user.id) {
          this.server.to(userChat.id).emit('messageSentChann', { message: "message sent to channel", value: value, messages: chann.messages });
        }
      }
    }
  }

  @SubscribeMessage('createChannel')
  async handleCreateChannel(client: Socket, params: any): Promise<void> {
    const name = params.name;
    const ownerId = parseInt(String(params.ownerId));
    const isPrivate = params.isPrivate;
    const password = params.password;

    const channel = await this.prisma.channel.findUnique({ where: { name: name } });
    if (channel) {
      console.log("Le channel existe deja");
      // emit un retour d'erreur
      return;
    }

    await this.prisma.channel.create({
      data: {
        name: name,
        ownerId: ownerId,
        isPrivate: isPrivate,
        password: isPrivate ? password : null,
        usersList: {
          connect: [
            { id: ownerId },
          ]
        },
        adminList: {
          connect: [
            { id: ownerId },
          ]
        }
      }
    });

    client.emit('channelCreated', { message: 'channelCreated', name });
  }


  @SubscribeMessage('joinRoom') // Écoutez l'événement 'joinRoom'
  async handleJoinRoom(client: Socket, params: any): Promise<void> {
    const name = params.name;
    const userId = parseInt(String(params.userId));

    const chann = await this.prisma.channel.findUnique({
      where: {
        name: name // Assurez-vous que "name" est correctement défini
      },
      include: {
        usersList: true,
        banList: true,
      }
    });

    if (!chann) {
      console.log("Le channel n'existe pas");
      return;
    }

    for (let i = 0; i < chann.usersList.length; i++) {
      if (chann.usersList[i].id == userId) {
        console.log(userId + ' is already in' + name);
        //this.server.emit('userBanned', { userId });
        return;
      }
    }

    for (let i = 0; i < chann.banList.length; i++) {
      if (chann.banList[i].id == userId) {
        console.log(userId + ' is banned from ' + name);
        //this.server.emit('userBanned', { userId });
        return;
      }
    }
    try {
      await this.prisma.channel.update({
        where: { name: name },
        data: {
          usersList: {
            connect: {
              id: userId,
            }
          },
        },
      });
    }
    catch (e) {
      console.log(e);
    }
    client.emit('userJoined', { userId });
  }


  @SubscribeMessage('kickUser')
  async handleKickUser(client: Socket, params: any): Promise<void> {
    const channName = params.channName;
    const userId = parseInt(String(params.userId));
    const otherName = String(params.otherName);
    const chann = await this.prisma.channel.findUnique({
      where: {
        name: channName
      },
      include: {
        usersList: true,
        adminList: true,
      }
    });
    if (!chann) {
      console.log("Le channel n'existe pas");
      return;
    }

    const user = await this.prisma.user.findUnique({ where: { name: otherName } });

    if (!user) {
      console.log("La cible n'existe pas");
      return;
    }

    let i;
    for (i = 0; i < chann.adminList.length; i++) {
      if (chann.adminList[i].id == userId) {
        break;
      }
    }
    if (i == chann.adminList.length) {
      console.log("Vous n'etes pas admin")
      return;
    }

    for (i = 0; i < chann.usersList.length; i++) {
      if (chann.usersList[i].id == user.id)
        break;
    }
    if (i == chann.usersList.length) {
      console.log("La cible n'est pas dans le channel")
    }

    for (i = 0; i < chann.adminList.length; i++) {
      if (chann.adminList[i].name == otherName && userId != chann.ownerId) {
        console.log("La cible est un admin");
        return;
      }
    }
    const newChann = await this.prisma.channel.update({
      where: { name: channName },
      data: {
        usersList: {
          disconnect: {
            id: user.id,
          }
        },
        adminList: {
          disconnect: {
            id: user.id,
          }
        }
      },
      include: {
        usersList: true,
      }
    });
    for (let user of newChann.usersList) {
      for (let userChat of this.users) {
        if (user.id === userChat.user.id) {
          this.server.to(userChat.id).emit('userKicked', { otherName });
        }
      }
    }
    // A TESTER
  }

  @SubscribeMessage('leaveRoom') // Écoutez l'événement 'leaveRoom'
  async handleLeaveRoom(client: Socket, params: any): Promise<void> {
    const name = params.name;
    const userId = parseInt(String(params.userId));
    const chann = await this.prisma.channel.findUnique({
      where: {
        name: name // Assurez-vous que "name" est correctement défini
      },
      include: {
        usersList: true,
        banList: true,
      }
    });

    try {
      await this.prisma.channel.update({
        where: { name: name },
        data: {
          usersList: {
            disconnect: {
              id: userId,
            }
          },
        },
      });
    }
    catch (e) {
      console.log(e);
    }
    client.emit('userLeft', { userId });
  }

  @SubscribeMessage('deleteRoom')
  async handleDeleteRoom(@MessageBody() data: { name: string, userId: string}): Promise<void> {
    {
    const { name , userId} = data;
  
    console.log('Deleted room with name:', name);
  

    // Avant de supprimer la room, vous pouvez rechercher son ID en fonction de son nom.
    const room = await this.prisma.channel.findUnique({
      where: { name: name },
    });

    if (room.ownerId == userId) {
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
  async handleBanRoom(client: Socket, params: any): Promise<void> {
    const name = params.name;
    const userId = parseInt(String(params.userId));

    console.log('Banned user with id:', userId, 'from room:', name);

    const chann = await this.prisma.channel.findUnique({
      where: {
        name: name // Assurez-vous que "name" est correctement défini
      }
    });
    if (!chann) {
      return;
    }
    try {
      await this.prisma.channel.update({
        where: { name: name },
        data: {
          banList: {
            connect: {
              id: userId,
            }
          },
          usersList: {
            disconnect: {
              id: userId,
            }
          },
        },
      });
    }
    catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('setAdmin')
  async handleSetAdmin(client: Socket, params: any): Promise<void> {
    const name = params.name;
    const userId = parseInt(String(params.userId));

    console.log('Set admin with id:', userId, 'from room:', name);

    const chann = await this.prisma.channel.findUnique({
      where: {
        name: name
      }
    });

    try {
      await this.prisma.channel.update({
        where: { name: name },
        data: {
          adminList: {
            connect: {
              id: userId,
            }
          },
        },
      });
    }
    catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('unsetAdmin')
  async handleUnsetAdmin(client: Socket, params: any): Promise<void> {
    const name = params.name;
    const userId = parseInt(String(params.userId));
    console.log('Unset admin with id:', userId, 'from room:', name);
    const chann = await this.prisma.channel.findUnique({
      where: {
        name: name // Assurez-vous que "name" est correctement défini
      }
    });
    try {
      await this.prisma.channel.update({
        where: { name: name },
        data: {
          adminList: {
            disconnect: {
              id: userId,
            }
          },
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
      where: { id: userId },
    });
    if (!user || user.name === otherName)
      return;
    const otherUser = await this.prisma.user.findUnique({
      where: { name: otherName },
    });
    if (!otherUser || otherUser.id === id) {
      return;
    };
    // verifier que l'id existe dans la bdd 
    const convs = await this.prisma.conversation.findMany();
    for (let i = 0; i < convs.length; i++) {
      if ((user.name === convs[i].names[0] && otherName === convs[i].names[1]) || (user.name === convs[i].names[1] && otherName === convs[i].names[0])) {
        return;
      }
    }
    const conversation = await this.prisma.conversation.create({
      data: {
        users: {
          connect: [
            { id: userId },
            { id: otherUser.id },
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
    client.emit('conversationCreated', { message: "CA MARCHE", otherUser: shortUser, conversation: conversation });
  }
}


