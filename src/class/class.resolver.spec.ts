import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from 'src/card/card.service';
import { Card } from 'src/card/entities/card.entity';
import CardModelFactory from 'src/utils/test/card.model.factory';
import ClassModelFactory from 'src/utils/test/class.model.factory';
import { ClassResolver } from './class.resolver';
import { ClassService } from './class.service';
import { Class } from './entities/class.entity';

describe('ClassResolver', () => {
  let resolver: ClassResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassResolver,
        ClassService,
        CardService,
        {
          provide: getModelToken(Class),
          useValue: ClassModelFactory,
        },
        {
          provide: getModelToken(Card),
          useValue: CardModelFactory,
        },
      ],
    }).compile();

    resolver = module.get<ClassResolver>(ClassResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a card class', async () => {
      const result = await resolver.findOne(1, {
        fields: ['id'],
        relations: {},
      });
      expect(result.id).toBe(1);
    });

    it('should fail if the class is not found', async () => {
      const classId = 3;
      const t = async () => {
        await resolver.findOne(classId, { fields: ['id'], relations: {} });
      };
      expect(t).rejects.toThrow(NotFoundException);
    });
  });
});
