import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TwofaService } from './twofa.service';

@Controller('twofa')
export class TwofaController {
  constructor(private readonly twofaService: TwofaService) {}
}
