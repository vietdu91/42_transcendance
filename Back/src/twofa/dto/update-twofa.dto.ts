import { PartialType } from '@nestjs/mapped-types';
import { CreateTwofaDto } from './create-twofa.dto';

export class UpdateTwofaDto extends PartialType(CreateTwofaDto) {}
