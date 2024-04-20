import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserArgs } from './dto/create-user.args';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const userModelMock = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: userModelMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a user', async () => {
      const email = 'test@test.com';
      userModelMock.findOne.mockImplementationOnce(() => {
        return {
          id: 1,
          email,
        };
      });
      const result = await service.findOne(email);
      expect(userModelMock.findOne).toHaveBeenCalled();
      expect(result.email).toBe(email);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const email = 'test@test.com';
      const args: CreateUserArgs = {
        email,
        name: 'Test',
        password: '123',
      };

      userModelMock.create.mockImplementationOnce(() => {
        return {
          ...args,
          id: 1,
        };
      });
      const result = await service.create(args);
      expect(userModelMock.create).toHaveBeenCalled();
      expect(userModelMock.create).toHaveBeenCalledWith(args);
      expect(result.email).toBe(email);
    });
  });
});
