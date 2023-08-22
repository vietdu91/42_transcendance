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
        ownerId: parseInt(name[1]),
        
      },
    });
    this.server.emit({message: 'channelCreated', name: name});
  }
}

