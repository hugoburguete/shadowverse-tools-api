import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import ClassModelFactory from 'src/utils/test/class.model.factory';
import { ClassService } from './class.service';
import { FindAllClassesArgs } from './dto/find-all-classes.args';
import { FindOneClassArgs } from './dto/find-one-class.args';
import { Class } from './entities/class.entity';

describe('ClassService', () => {
  let service: ClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassService,
        {
          provide: getModelToken(Class),
          useValue: ClassModelFactory,
        },
      ],
    }).compile();

    service = module.get<ClassService>(ClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a card class', async () => {
      const args = new FindOneClassArgs();
      args.id = 1;
      args.attributes = {
        fields: ['id'],
        relations: {},
      };
      const result = await service.findOne(args);
      expect(result.id).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return a card class', async () => {
      const args = new FindAllClassesArgs();
      args.attributes = {
        fields: ['id'],
        relations: {},
      };
      const result = await service.findAll(args);
      expect(result.length).toBe(2);
      expect(result[1].id).toBe(2);
    });
  });
});
