import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
 
@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService
  ) {}

}