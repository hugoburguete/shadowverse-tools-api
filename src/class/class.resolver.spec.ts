import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from 'src/card/card.service';
import { Card } from 'src/card/entities/card.entity';
import CardModelFactory from 'src/common/test-utils/card.model.factory';
import ClassModelFactory from 'src/common/test-utils/class.model.factory';
import { ClassResolver } from './class.resolver';
import { ClassService } from './class.service';
import { FindAllClassesArgs } from './dto/find-all-classes.args';
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

  describe('findAll', () => {
    it('should return all card classes', async () => {
      const result = await resolver.findAll(new FindAllClassesArgs(), {
        fields: ['id'],
        relations: {},
      });
      expect(result.edges.length).toBe(2);
    });
  });
});
