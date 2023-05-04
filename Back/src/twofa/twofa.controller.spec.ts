import { Test, TestingModule } from '@nestjs/testing';
import { TwofaController } from './twofa.controller';
import { TwofaService } from './twofa.service';

describe('TwofaController', () => {
  let controller: TwofaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwofaController],
      providers: [TwofaService],
    }).compile();

    controller = module.get<TwofaController>(TwofaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
