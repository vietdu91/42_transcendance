import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { Server, Socket } from 'socket.io';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

type UserChat = {
  id: string;
  user: User;
}

@WebSocketGateway({ cors: '*' })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private jwtService = new JwtService();
  private prisma = new PrismaService();
  private userService = new UserService(this.prisma);

  private users: UserChat[] = [];

  constructor() { } // Injectez PrismaService via le constructeur

  @SubscribeMessage('joinChat')
  async handleJoinChat(client: Socket): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);

    for (let user of this.users) {
      if (user.id === client.id) {
        return;
      }
    }

    const userChat: UserChat = {
      id: client.id,
      user: userDb,
    }
    this.users.push(userChat);

    client.emit('chatJoined', { message: 'Joined Chat' });
  }

  @SubscribeMessage('sendMessageConv')
  async handleMessageConv(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);

    const value = params.value;
    const convId = params.convId;

    const message = await this.prisma.message.create({
      data: {
        content: value,
        authorId: userDb.id,
        authorName: userDb.name,
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
          let persoMessages = conv.messages.filter((index) => !(user.blockList.includes(index.authorId)));
          this.server.to(userChat.id).emit('messageSentConv', { message: "message sent to conversation", value: value, messages: persoMessages });
        }
      }
    }
  }

  @SubscribeMessage('sendMessageChann')
  async handleMessageChann(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);

    const value = params.value;
    const channId = params.channId;

    const message = await this.prisma.message.create({
      data: {
        content: value,
        authorId: userDb.id,
        authorName: userDb.name,
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
          let persoMessages = chann.messages.filter((index) => !(user.blockList.includes(index.authorId)));
          this.server.to(userChat.id).emit('messageSentChann', { message: "message sent to channel", value: value, messages: persoMessages });
        }
      }
    }
  }

  @SubscribeMessage('createChannel')
  async handleCreateChannel(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);

    const name = params.name;
    const isPrivate = params.isPrivate;
    const password = params.password;

    console.log("password ++ " + password);
    const hashPassword = await argon2.hash(password);
    console.log("hashPassword ++ " + hashPassword);

    const channel = await this.prisma.channel.findUnique({ where: { name: name } });
    if (channel) {
      client.emit('errorSocket', { message: "This channel already exists" });
      return;
    }

    const regex: RegExp = /^[a-zA-Z\-\_]{2,20}$/;
    if (!regex.test(name)) {
      client.emit('errorSocket', { message: "Not a valid channel name" });
      return;
    }

    await this.prisma.channel.create({
      data: {
        name: name,
        ownerId: userDb.id,
        isPrivate: isPrivate,
        image: 'https://res.cloudinary.com/dsvw15bam/image/upload/v1694703850/avatars-ubXQyNB9MhoSHi6Q-2bLbtw-t500x500_tiff9c.jpg',
        password: isPrivate ? hashPassword : null,
        usersList: {
          connect: [
            { id: userDb.id },
          ]
        },
        adminList: {
          connect: [
            { id: userDb.id },
          ]
        }
      }
    });

    const user = await this.prisma.user.findUnique({
      where: { id: userDb.id },
      include: {
        channels: {
          include: {
            messages: true,
            usersList: true,
          }
        },
      }
    })

    client.emit('channelCreated', { message: "Channel Created", channels: user.channels, friends: user.friendsList });
  }


  @SubscribeMessage('joinRoom') // Écoutez l'événement 'joinRoom'
  async handleJoinRoom(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);
    console.log("hiihihia")
    const name = params.name;

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
      client.emit('errorSocket', { message: "This channel doesn't exist" });
      return;
    }
    console.log("hihihi");
    for (let i = 0; i < chann.usersList.length; i++) {
      console.log(chann.usersList[i].id, userDb.id)
      if (chann.usersList[i].id == userDb.id) {
        console.log(userDb.id + ' is already in' + name);
        client.emit('errorSocket', { message: "You already are in the channel" });
        return;
      }
    }

    for (let i = 0; i < chann.banList.length; i++) {
      if (chann.banList[i].id == userDb.id) {
        console.log(userDb.id + ' is banned from ' + name);
        client.emit('errorSocket', { message: "You are banned from the channel" });
        return;
      }
    }
    try 
    {
      const verifyHash = await argon2.verify(chann.password, params.password);
    }
    catch (e) {
      console.log("Pas de mot de passe");
      return;
    }

    await this.prisma.channel.update({
      where: { name: name },
      data: {
        usersList: {
          connect: {
            id: userDb.id,
          }
        },
      },
    });
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userDb.id },
        include: {
          channels: {
            include: {
              messages: true,
              usersList: true,
            }
          }
        }
      })
      client.emit('channelJoined', { message: "Channel Joined", channels: user.channels, friends: user.friendsList });
    } catch (e) {
      throw e;
    }
  }



  @SubscribeMessage('kickUser')
  async handleKickUser(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);

    const channName = params.channName;
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
      client.emit('errorSocket', { message: "The channel doesn't exist" });
      return;
    }

    const target = await this.prisma.user.findUnique({ where: { name: otherName } });

    if (!target) {
      client.emit('errorSocket', { message: "The target " + otherName + " doesn't exist" });
      return;
    }

    let i;
    for (i = 0; i < chann.adminList.length; i++) {
      if (chann.adminList[i].id == userDb.id) {
        break;
      }
    }
    if (i == chann.adminList.length) {
      client.emit('errorSocket', { message: "You are not a channel admin" });
      return;
    }

    for (i = 0; i < chann.usersList.length; i++) {
      if (chann.usersList[i].id == target.id)
        break;
    }
    if (i == chann.usersList.length) {
      client.emit('errorSocket', { message: "The target " + otherName + " is not in the channel" });
      return;
    }

    for (i = 0; i < chann.adminList.length; i++) {
      if (chann.adminList[i].name == otherName && userDb.id != chann.ownerId) {
        client.emit('errorSocket', { message: "The target " + otherName + " is a chann admin" });
        return;
      }
    }
    const newChann = await this.prisma.channel.update({
      where: { name: channName },
      data: {
        usersList: {
          disconnect: {
            id: target.id,
          }
        },
        adminList: {
          disconnect: {
            id: target.id,
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
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);

    const name = params.name;
    const chann = await this.prisma.channel.findUnique({
      where: {
        name: name // Assurez-vous que "name" est correctement défini
      },
      include: {
        usersList: true,
        banList: true,
      }
    });

    await this.prisma.channel.update({
      where: { name: name },
      data: {
        usersList: {
          disconnect: {
            id: userDb.id,
          }
        },
      },
    });
    client.emit('userLeft', { userId: userDb.id });
  }

  @SubscribeMessage('deleteRoom')
  async handleDeleteRoom(client: Socket, params: any): Promise<void> {
    {
      const token: string = client.handshake.query.token as string;
      const userToken = await this.jwtService.decode(token);
      const userDb = await this.userService.getUserById(userToken.sub);

      const name = params.name;
      // Avant de supprimer la room, vous pouvez rechercher son ID en fonction de son nom.
      const room = await this.prisma.channel.findUnique({
        where: { name: name },
      });

      if (room.ownerId == userDb.id) {
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
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);

    const name = params.name;
    const chann = await this.prisma.channel.findUnique({
      where: {
        name: name // Assurez-vous que "name" est correctement défini
      }
    });
    if (!chann) {
      return;
    }
    await this.prisma.channel.update({
      where: { name: name },
      data: {
        banList: {
          connect: {
            id: userDb.id,
          }
        },
        usersList: {
          disconnect: {
            id: userDb.id,
          }
        },
      },
    });
  }

  @SubscribeMessage('setAdmin')
  async handleSetAdmin(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);

    const name = params.name;

    const chann = await this.prisma.channel.findUnique({
      where: {
        name: name
      }
    });

    await this.prisma.channel.update({
      where: { name: name },
      data: {
        adminList: {
          connect: {
            id: userDb.id,
          }
        },
      },
    });
  }

  @SubscribeMessage('unsetAdmin')
  async handleUnsetAdmin(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);

    const name = params.name;
    const chann = await this.prisma.channel.findUnique({
      where: {
        name: name // Assurez-vous que "name" est correctement défini
      }
    });
    await this.prisma.channel.update({
      where: { name: name },
      data: {
        adminList: {
          disconnect: {
            id: userDb.id,
          }
        },
      },
    });
  }

  @SubscribeMessage('createConversation')
  async handleCreateConversation(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const user = await this.userService.getUserById(userToken.sub);

    const otherName = params.otherName;

    if (user.name === otherName) {
      client.emit('errorSocket', { message: "You can't talk to yourself" });
      return;
    }
    const otherUser = await this.prisma.user.findUnique({
      where: { name: otherName },
    });
    if (!otherUser || otherUser.id === user.id) {
      client.emit('errorSocket', { message: "You can't talk to yourself" });
      return;
    };
    const convs = await this.prisma.conversation.findMany();
    for (let i = 0; i < convs.length; i++) {
      if ((user.name === convs[i].names[0] && otherName === convs[i].names[1]) || (user.name === convs[i].names[1] && otherName === convs[i].names[0])) {
        client.emit('errorSocket', { message: "You already have a conversation with " + otherUser.name });
        return;
      }
    }
    await this.prisma.conversation.create({
      data: {
        users: {
          connect: [
            { id: user.id },
            { id: otherUser.id },
          ]
        },
        usersID: [user.id, otherUser.id],
        names: [user.name, otherName],
      }
    });
    const newUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        conversations: {
          include: {
            messages: true,
          }
        },
      }
    })
    const shortUser = {
      name: otherName,
      nickname: otherUser.nickname,
      pfp: otherUser.pfp_url,
      state: otherUser.state,
    }
    client.emit('conversationCreated', { message: "CA MARCHE", otherUser: shortUser, conversations: newUser.conversations, friends: newUser.friendsList });
  }
}


