import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';
import { Server, Socket } from 'socket.io';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { verify } from 'crypto';

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
    console.log(userToken);
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
    
    const chann = await this.prisma.channel.findUnique({
      where: { id: channId },
      include: {
        messages: true,
        usersList: true,
        mutedList: true,
      }
    })
    
    if (!chann) {
      client.emit('errorSocket', { message: "This channel doesn't exist" });
      return;
    }
    
    
    const isMuted = chann.mutedList.find(user => user.id === userDb.id);
    if (isMuted) {
      client.emit('errorSocket', { message: "You are muted in this channel" });
      return;
    }

    const message = await this.prisma.message.create({
      data: {
        content: value,
        authorId: userDb.id,
        authorName: userDb.name,
        channelId: channId,
      }
    });

    const newChann = await this.prisma.channel.findUnique({
      where: { id: channId },
      include: {
        messages: true,
        usersList: true,
        mutedList: true,
      }
    })

    for (let user of newChann.usersList) {
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
    let password = params.password;

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

    if (password) {
      const regexPsswd: RegExp = /^[a-zA-Z0-9@#$%^&+=!\*]{5,30}$/;
      if (!regexPsswd.test(password)) {
        client.emit('errorSocket', { message: "Not a valid password : a-z,A-Z,0-9,@#$%^&+=!* (min 5, max 30)" });
        return;
      }
      password = await argon2.hash(password);
    }

    await this.prisma.channel.create({
      data: {
        name: name,
        ownerId: userDb.id,
        isPrivate: isPrivate,
        image: 'https://res.cloudinary.com/dsvw15bam/image/upload/v1695365476/qpws7dliiofbiklrrlf4.jpg',
        password: isPrivate ? password : null,
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
            adminList: true,
            mutedList: true,
          }
        },
      }
    })
    client.emit('channelCreated', { message: "Channel Created", channels: user.channels, friends: user.friendsList });
  }


  @SubscribeMessage('joinChannel')
  async handleJoinRoom(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);
    const name = params.name;
    const password = params.password;

    const chann = await this.prisma.channel.findUnique({
      where: {
        name: name
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

    const isAlreadyIn = chann.usersList.find(user => user.id === userDb.id);
    if (isAlreadyIn) {
      client.emit('errorSocket', { message: "You already are in the channel" });
      return;
    }

    let verifyHash;
    if (chann.password) {
      verifyHash = await argon2.verify(chann.password, password);
      if (!verifyHash) {
        client.emit('errorSocket', { message: "Wrong password" });
        return;
      }
    }

    const isBanned = chann.banList.find(user => user.id === userDb.id);
    if (isBanned) {
      client.emit('errorSocket', { message: "You are banned from this channel" });
      return;
    }
    const newChann = await this.prisma.channel.update({
      where: { name: name },
      data: {
        usersList: {
          connect: {
            id: userDb.id,
          }
        },
      },
      include: {
        usersList: {
          include: {
            channels: {
              include: {
                usersList: true,
                messages: true,
                adminList: true,
                mutedList: true,
              }
            }
          }
        }
      }
    });
    for (let users of newChann.usersList) {
      for (let userChat of this.users) {
        if (users.id === userChat.user.id) {
          this.server.to(userChat.id).emit('channelJoined', { message: "Channel Joined", channels: users.channels, friends: users.friendsList });
        }
      }
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

    if (target.name === userDb.name) {
      client.emit('errorSocket', { message: "You can't kick yourself" });
      return;
    }

    const isUser = chann.usersList.find(user => user.id === target.id);
    if (!isUser) {
      client.emit('errorSocket', { message: "The target " + otherName + " is not in the channel" });
      return;
    }
    const isAdmin = chann.adminList.find(admin => admin.id === userDb.id);
    if (!isAdmin) {
      client.emit('errorSocket', { message: "You are not a channel admin" });
      return;
    }

    const isAdmin2 = chann.adminList.find(admin => admin.id === target.id);
    if (isAdmin2 && userDb.id != chann.ownerId) {
      client.emit('errorSocket', { message: "The target " + otherName + " is a channel admin" });
      return;
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
        usersList: {
          include: {
            channels: {
              include: {
                messages: true,
                usersList: true,
                adminList: true,
                banList: true,
                mutedList: true,
              }
            },
          }
        },
      }
    });
    for (let user of newChann.usersList) {
      for (let userChat of this.users) {
        if (user.id === userChat.user.id) {
          this.server.to(userChat.id).emit('userKicked', { channels: user.channels });
        }
      }
    }
    const newTarget = await this.prisma.user.findUnique({
      where: { name: otherName },
      include: {
        channels: {
          include: {
            messages: true,
            usersList: true,
            adminList: true,
            banList: true,
            mutedList: true,
          }
        },
      }
    });
    for (let userChat of this.users) {
      if (newTarget.id === userChat.user.id) {
        this.server.to(userChat.id).emit('userKicked', { channels: newTarget.channels });
        this.server.to(userChat.id).emit('errorSocket', { message: "You have been kicked from " + newChann.name });
      }
    }
  }

  @SubscribeMessage('leaveChannel')
  async handleLeaveRoom(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);

    const channName = params.name;
    const chann = await this.prisma.channel.findUnique({
      where: {
        name: channName
      },
      include: {
        usersList: {
          include: {
            channels: {
              include: {
                messages: true,
                usersList: true,
              }
            }
          }
        },
        banList: true,
        adminList: true,
      }
    });
    if (!chann) {
      client.emit('errorSocket', { message: "This channel doesn't exist" });
      return;
    }

    const isUser = chann.usersList.find(user => user.id === userDb.id);
    if (!isUser) {
      client.emit('errorSocket', { message: "The target " + userDb.name + " is not in the channel" });
      return;
    }

    const isAdmin = chann.adminList.find(admin => admin.id === userDb.id);
    if (isAdmin && userDb.id == chann.ownerId) {
      await this.prisma.channel.delete({
        where: { name: chann.name },
      });
      for (let user of chann.usersList) {
        for (let userChat of this.users) {
          if (user.id === userChat.user.id) {
            this.server.to(userChat.id).emit('roomDeleted', { channels: user.channels.filter((index) => index.name !== channName) });
          }
        }
      }
      const newUser = await this.prisma.user.findUnique({
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
      client.emit('userLeft', { channels: newUser.channels });
      return;
    }

    const newChann = await this.prisma.channel.update({
      where: { name: chann.name },
      data: {
        usersList: {
          disconnect: {
            id: userDb.id,
          }
        },
      },
      include: {
        usersList: {
          include: {
            channels: {
              include: {
                messages: true,
                usersList: true,
                adminList: true,
                mutedList: true,
              }
            },
          }
        },
      }
    });

    const remainingUsersCount = await this.prisma.channel.count({
      where: {
        name: chann.name,
        usersList: {
          some: {}
        }
      }
    });
    if (remainingUsersCount === 0) {
      await this.prisma.channel.delete({
        where: { name: newChann.name },
      });
    } else {
      for (let user of newChann.usersList) {
        for (let userChat of this.users) {
          if (user.id === userChat.user.id) {
            this.server.to(userChat.id).emit('userLeft', { channels: user.channels });
          }
        }
      }
      const newUser = await this.prisma.user.findUnique({
        where: { id: userDb.id },
        include: {
          channels: {
            include: {
              messages: true,
              usersList: true,
              adminList: true,
              mutedList: true,
            }
          }
        }
      })
      client.emit('userLeft', { channels: newUser.channels });
    }
  }

  @SubscribeMessage('deleteRoom')
  async handleDeleteRoom(client: Socket, params: any): Promise<void> {
    {
      const token: string = client.handshake.query.token as string;
      const userToken = await this.jwtService.decode(token);
      const userDb = await this.userService.getUserById(userToken.sub);

      const name = params.name;
      const room = await this.prisma.channel.findUnique({
        where: { name: name },
        include: {
          usersList: {
            include: {
              channels: {
                include: {
                  messages: true,
                  usersList: true,
                  adminList: true,
                  mutedList: true,
                }
              }
            }
          },
        }
      });
      if (room.ownerId == userDb.id) {
        await this.prisma.channel.delete({
          where: { id: room.id },
        });

        for (let user of room.usersList) {
          for (let userChat of this.users) {
            if (user.id === userChat.user.id) {
              this.server.to(userChat.id).emit('roomDeleted', { channels: user.channels.filter((index) => index.name !== name) });
            }
          }
        }
      } else {
        client.emit('errorSocket', { message: "You don't have the rights to do that." })
      }
    }
  }

  @SubscribeMessage('banUser')
  async handleBanRoom(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);

    const name = params.name;
    const channName = params.channName;
    const chann = await this.prisma.channel.findUnique({
      where: {
        name: channName
      },
      include: {
        adminList: true,
        usersList: true,
        mutedList: true,
        banList: true,
      }
    });

    if (!chann) {
      return;
    }
    const isAdmin = chann.adminList.find(admin => admin.id === userDb.id);
    if (!isAdmin) {
      client.emit('errorSocket', { message: "You are not a channel admin" });
      return;
    }

    const target = await this.prisma.user.findUnique({
      where: { name: name },
      include: {
        channels: true,
      }
    })

    if (!target) {
      client.emit('errorSocket', { message: "The target " + name + " doesn't exist" });
      return;
    }
    const isUser = chann.usersList.find(user => user.id === target.id);
    if (!isUser) {
      client.emit('errorSocket', { message: "The target " + name + " is not in the channel" });
      return;
    }

    if (target.id == userDb.id) {
      client.emit('errorSocket', { message: "You can't ban yourself" });
      return;
    }

    const isAdmin2 = chann.adminList.find(admin => admin.id === target.id);
    if (isAdmin2 && userDb.id != chann.ownerId) {
      client.emit('errorSocket', { message: "The target " + name + " is a channel admin" });
      return;
    }

    const newChann = await this.prisma.channel.update({
      where: { name: channName },
      data: {
        banList: {
          connect: {
            id: target.id,
          }
        },
        usersList: {
          disconnect: {
            id: target.id,
          }
        },
        mutedList: {
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
        usersList: {
          include: {
            channels: {
              include: {
                usersList: true,
                adminList: true,
                banList: true,
                mutedList: true,
                messages: true,
              }
            }
          }
        },
      }
    });

    for (let user of newChann.usersList) {
      for (let userChat of this.users) {
        if (user.id === userChat.user.id) {
          this.server.to(userChat.id).emit('userBanned', { channels: user.channels });
        }
      }
    }
    const newTarget = await this.prisma.user.findUnique({
      where: { id: target.id },
      include: {
        channels: {
          include: {
            usersList: true,
            adminList: true,
            banList: true,
            mutedList: true,
            messages: true,
          }
        }
      }
    })
    for (let userChat of this.users) {
      if (newTarget.id === userChat.user.id) {
        this.server.to(userChat.id).emit('errorSocket', { message: "You have been banned from " + newChann.name });
        this.server.to(userChat.id).emit('userBanned', { channels: newTarget.channels });
        return;
      }
    }
  }

  @SubscribeMessage('setAdmin')
  async handleSetAdmin(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);

    const newAdmin = params.name;
    const channName = params.channName;

    if (newAdmin === userDb.name) {
      client.emit('errorSocket', { message: "You can't set yourself as an admin" });
      return;
    }

    const chann = await this.prisma.channel.findUnique({
      where: {
        name: channName
      },
      include: {
        adminList: true,
        usersList: true,
        mutedList: true,
      }
    });

    if (!chann) {
      client.emit('errorSocket', { message: "This channel doesn't exist" });
      return;
    }

    if (userDb.id != chann.ownerId) {
      client.emit('errorSocket', { message: "You are not the channel owner" });
      return;
    }

    const target = await this.prisma.user.findUnique({
      where: { name: newAdmin },
      include: {
        channels: true,
      }
    })

    if (!target) {
      client.emit('errorSocket', { message: "The target " + newAdmin + " doesn't exist" });
      return;
    }

    const isUser = chann.usersList.find(user => user.id === target.id);
    if (!isUser) {
      client.emit('errorSocket', { message: "The target " + newAdmin + " is not in the channel" });
      return;
    }

    const isAdmin2 = chann.adminList.find(admin => admin.id === target.id);
    if (isAdmin2) {
      client.emit('errorSocket', { message: "The target " + newAdmin + " is already a channel admin" });
      return;
    }


    await this.prisma.channel.update({
      where: { name: channName },
      data: {
        adminList: {
          connect: {
            id: target.id,
          }
        },
      },
    });
    const newUser = await this.prisma.user.findUnique({
      where: { id: userDb.id },
      include: {
        channels: {
          include: {
            usersList: true,
            adminList: true,
            banList: true,
            mutedList: true,
            messages: true,
          }
        }
      }
    })

    client.emit('adminSet', { channels: newUser.channels });
    
    const newTarget = await this.prisma.user.findUnique({
      where: { id: target.id },
      include: {
        channels: {
          include: {
            usersList: true,
            adminList: true,
            banList: true,
            mutedList: true,
            messages: true,
          }
        }
      }
    })
    for (let userChat of this.users) {
      if (newTarget.id === userChat.user.id) {
        this.server.to(userChat.id).emit('errorSocket', { message: "You are now admin on " + channName });
        this.server.to(userChat.id).emit('adminSet', { channels: newTarget.channels });
        return;
      }
    }
  }

  @SubscribeMessage('unsetAdmin')
  async handleUnsetAdmin(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const userDb = await this.userService.getUserById(userToken.sub);

    const channName = params.channName;
    const deleteAdmin = params.name;

    const chann = await this.prisma.channel.findUnique({
      where: {
        name: channName
      },
      include: {
        adminList: true,
        usersList: true,
        mutedList: true,
      }
    });

    if (!chann) {
      client.emit('errorSocket', { message: "This channel doesn't exist" });
      return;
    }

    if (userDb.id != chann.ownerId) {
      client.emit('errorSocket', { message: "You are not the channel owner" });
      return;
    }

    const target = await this.prisma.user.findUnique({
      where: { name: deleteAdmin },
      include: {
        channels: true,
      }
    })

    if (!target) {
      client.emit('errorSocket', { message: "The target " + deleteAdmin + " doesn't exist" });
      return;
    }

    const isAdmin = chann.adminList.find(admin => admin.id === target.id);
    if (!isAdmin) {
      client.emit('errorSocket', { message: "The target " + deleteAdmin + " is not a channel admin" });
      return;
    }

    await this.prisma.channel.update({
      where: { name: channName },
      data: {
        adminList: {
          disconnect: {
            id: target.id,
          }
        },
      },
    });

    const newUser = await this.prisma.user.findUnique({
      where: { id: userDb.id },
      include: {
        channels: {
          include: {
            usersList: true,
            adminList: true,
            banList: true,
            mutedList: true,
            messages: true,
          }
        }
      }
    })

    client.emit('adminUnset', { channels: newUser.channels });
    
    const newTarget = await this.prisma.user.findUnique({
      where: { id: target.id },
      include: {
        channels: {
          include: {
            usersList: true,
            adminList: true,
            banList: true,
            mutedList: true,
            messages: true,
          }
        }
      }
    })
    for (let userChat of this.users) {
      if (newTarget.id === userChat.user.id) {
        this.server.to(userChat.id).emit('errorSocket', { message: "You are not admin anymore on " + channName });
        this.server.to(userChat.id).emit('adminUnset', { channels: newTarget.channels });
        return;
      }
    }
  }

  @SubscribeMessage('createConversation')
  async handleCreateConversation(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const user = await this.userService.getUserById(userToken.sub);
    if (!user) {
      client.emit('errorSocket', { message: "This user doesn't exist" });
      return;
    }

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
    client.emit('conversationCreated', { otherUser: shortUser, conversations: newUser.conversations, friends: newUser.friendsList });
  }

  @SubscribeMessage('changePassword')
  async handleChangePassword(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const user = await this.userService.getUserById(userToken.sub);

    const newPassword = params.newPassword;
    const oldPassword = params.oldPassword;
    const channName = params.channName;

    const chann = await this.prisma.channel.findUnique({
      where: {
        name: channName
      },
      include: {
        adminList: true,
        usersList: true,
      }
    });

    if (!chann) {
      client.emit('errorSocket', { message: "This channel doesn't exist" });
      return;
    }

    const isAdmin = chann.adminList.find(admin => admin.id === user.id);
    if (!isAdmin) {
      console.log("You are not a channel admin");
      client.emit('errorSocket', { message: "You are not a channel admin" });
      return;
    }

    const regexPsswd: RegExp = /^[a-zA-Z0-9@#$%^&+=!\*]{5,30}$/;
    if (!regexPsswd.test(newPassword)) {
      client.emit('errorSocket', { message: "Not a valid password : a-z,A-Z,0-9,@#$%^&+=!* (min 5, max 30)" });
      return;
    }

    const verifyHash = await argon2.verify(chann.password, oldPassword);
    if (!verifyHash) {
      client.emit('errorSocket', { message: "Wrong old password" });
      return;
    }

    const hashPassword = await argon2.hash(newPassword);
    const newChann = await this.prisma.channel.update({
      where: { name: channName },
      data: {
        password: hashPassword,
      },
      include: {
        usersList: true,
        adminList: true,
        mutedList: true,
      }
    });

    for (let user of newChann.usersList) {
      for (let userChat of this.users) {
        if (user.id === userChat.user.id) {
          this.server.to(userChat.id).emit('passwordChanged', { message: "Password changed" });
        }
      }
    }
  }

  @SubscribeMessage('unsetPassword')
  async handleUnsetPassword(client: Socket, params: any): Promise<void> {
    const channName = params.channName;
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const user = await this.userService.getUserById(userToken.sub);

    const chann = await this.prisma.channel.findUnique({
      where: {
        name: channName
      },
      include: {
        adminList: true,
        usersList: true,
        mutedList: true,
      }
    });

    if (!chann) {
      client.emit('errorSocket', { message: "This channel doesn't exist" });
      return;
    }

    if (user.id != chann.ownerId) {
      client.emit('errorSocket', { message: "You are not an owner channel admin" });
      return;
    }

    if (!chann.password) {
      client.emit('errorSocket', { message: "The channel doesn't have a password" });
      return;
    }

    const newChann = await this.prisma.channel.update({
      where: { name: channName },
      data: {
        password: null,
        isPrivate: false,
      },
      include: {
        usersList: true,
      }
    });
    for (let user of newChann.usersList) {
      for (let userChat of this.users) {
        if (user.id === userChat.user.id) {
          this.server.to(userChat.id).emit('passwordUnset', { message: "Password unset" });
        }
      }
    }
  }

  @SubscribeMessage('setMute')
  async handleSetMute(client: Socket, params: any): Promise<void> {
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const user = await this.userService.getUserById(userToken.sub);

    const channName = params.channName;
    const muteName = params.muteName;

    const chann = await this.prisma.channel.findUnique({
      where: {
        name: channName
      },
      include: {
        adminList: true,
        usersList: true,
        mutedList: true,
      }
    });

    if (!chann) {
      client.emit('errorSocket', { message: "This channel doesn't exist" });
      return;
    }

    const target = await this.prisma.user.findUnique({
      where: { name: muteName },
      include: {
        channels: true,
      }
    })

    if (!target) {
      client.emit('errorSocket', { message: "The target " + muteName + " doesn't exist" });
      return;
    }

    if (target.name === user.name) {
      client.emit('errorSocket', { message: "You can't mute yourself" });
      return;
    }

    const isUser = chann.usersList.find(user => user.id === target.id);
    if (!isUser) {
      client.emit('errorSocket', { message: "The target " + muteName + " is not in the channel" });
      return;
    }

    const isUserAdmin = chann.adminList.find(admin => admin.id === user.id);
    if (!isUserAdmin) {
      client.emit('errorSocket', { message: "You are not a channel admin" });
      return;
    }

    const isAdmin = chann.adminList.find(admin => admin.id === target.id);

    if (isAdmin && user.id != chann.ownerId) {
      client.emit('errorSocket', { message: "The target " + muteName + " is a channel admin" });
      return;
    }


    const isMuted = chann.mutedList.find(user => user.id === target.id);
    if (isMuted) {
      client.emit('errorSocket', { message: "The target " + muteName + " is already muted" });
      return;
    }

    await this.prisma.channel.update({
      where: { name: channName },
      data: {
        mutedList: {
          connect: {
            id: target.id,
          }
        },
      },
      include: {
        usersList: true,
      }
    });

    const newTarget = await this.prisma.user.findUnique({
      where: { id: target.id },
      include: {
        channels: {
          include: {
            usersList: true,
            adminList: true,
            banList: true,
            mutedList: true,
            messages: true,
          }
        }
      }
    })
    for (let userChat of this.users) {
      if (target.id === userChat.user.id) {
        this.server.to(userChat.id).emit('errorSocket', { message: "You are now muted on " + channName });
      }
    }
  }

  @SubscribeMessage('unsetMute')
  async handleUnsetMute(client: Socket, params: any): Promise<void> {
    const channName = params.channName;
    const muteName = params.muteName;
    const token: string = client.handshake.query.token as string;
    const userToken = await this.jwtService.decode(token);
    const user = await this.userService.getUserById(userToken.sub);

    const chann = await this.prisma.channel.findUnique({
      where: {
        name: channName
      },
      include: {
        adminList: true,
        usersList: true,
        mutedList: true,
      }
    });

    if (!chann) {
      client.emit('errorSocket', { message: "This channel doesn't exist" });
      return;
    }

    const target = await this.prisma.user.findUnique({
      where: { name: muteName },
      include: {
        channels: true,
      }
    })

    if (!target) {
      client.emit('errorSocket', { message: "The target " + muteName + " doesn't exist" });
      return;
    }

    const isUserAdmin = chann.adminList.find(admin => admin.id === user.id);
    if (!isUserAdmin) {
      client.emit('errorSocket', { message: "You are not a channel admin" });
      return;
    }

    const isAdmin = chann.adminList.find(admin => admin.id === target.id);
    if (isAdmin && user.id != chann.ownerId) {
      client.emit('errorSocket', { message: "The target " + muteName + " is a channel admin" });
      return;
    }

    const isUser = chann.usersList.find(user => user.id === target.id);
    if (!isUser) {
      client.emit('errorSocket', { message: "The target " + muteName + " is not in the channel" });
      return;
    }

    const isMuted = chann.mutedList.find(user => user.id === target.id);
    if (!isMuted) {
      client.emit('errorSocket', { message: "The target " + muteName + " is not muted" });
      return;
    }

    const newChann = await this.prisma.channel.update({
      where: { name: channName },
      data: {
        mutedList: {
          disconnect: {
            id: target.id,
          }
        },
      },
      include: {
        usersList: true,
      }
    });
    for (let userChat of this.users) {
      if (target.id === userChat.user.id) {
        this.server.to(userChat.id).emit('errorSocket', { message: "You are not muted anymore on " + channName });
      }
    }
  }
}