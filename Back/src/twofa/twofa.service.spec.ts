import { Test, TestingModule } from '@nestjs/testing';
import { TwofaService } from './twofa.service';

describe('TwofaService', () => {
  let service: TwofaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwofaService],
    }).compile();

    service = module.get<TwofaService>(TwofaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
