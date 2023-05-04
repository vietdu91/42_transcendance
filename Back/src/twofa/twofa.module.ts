import { Module } from '@nestjs/common';
import { TwofaService } from './twofa.service';
import { TwofaController } from './twofa.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TwofaController],
  providers: [TwofaService, PrismaService, ConfigService, JwtService],
})
export class TwofaModule {}
