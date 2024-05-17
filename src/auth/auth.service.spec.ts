import { AuthenticationError, ForbiddenError } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { genSaltSync, hashSync } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthService, AuthUser } from './auth.service';
import { RegisterInput } from './dto/register.input';

describe('AuthService', () => {
  let service: AuthService;
  const userServiceMock = {
    findOne: jest.fn((emailToFind) => {
      const email = 'test@test.com';
      if (emailToFind !== email) {
        return null;
      }
      const password = 'secret';
      const salt = genSaltSync(10);
      const hash = hashSync(password, salt);

      return {
        id: 1,
        firstname: 'My',
        lastname: 'user',
        password: hash,
        email: email,
      };
    }),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key.includes('expiry')) {
                return '1d';
              }
              return 'secret';
            },
          },
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if the password entered is correct', async () => {
      const password = 'secret';
      const email = 'test@test.com';

      const result = await service.validateUser(email, password);
      expect(userServiceMock.findOne).toHaveBeenCalled();
      expect(result).not.toBeNull();
    });

    it('should throw an error if the password entered is incorrect', async () => {
      const password = 'not-my-password';
      const email = 'test@test.com';

      await expect(service.validateUser(email, password)).rejects.toThrow(
        AuthenticationError,
      );
    });

    it("should throw an error if the user doesn't exist", async () => {
      const password = 'secret';
      const email = 'hackerman@test.com';

      await expect(service.validateUser(email, password)).rejects.toThrow(
        AuthenticationError,
      );
    });
  });

  describe('register', () => {
    it("should create a new user if it doesn't already exist", async () => {
      const password = 'secret';
      const email = 'newUser@test.com';
      const args: RegisterInput = {
        email,
        password,
        firstname: 'New',
        lastname: 'user',
      };

      userServiceMock.create.mockImplementationOnce(() => {
        return {
          id: 2,
          email: args.email,
        };
      });
      const result = await service.register(args);
      expect(userServiceMock.create).toHaveBeenCalled();
      expect(userServiceMock.create).toHaveBeenCalledWith(args);
      expect(result.accessToken).toBeTruthy();
    });

    it('should throw an error if the user already exist', async () => {
      const password = 'secret';
      const email = 'test@test.com';
      const args: RegisterInput = {
        email,
        password,
        firstname: 'New',
        lastname: 'user',
      };

      await expect(service.register(args)).rejects.toThrow(ForbiddenError);
    });
  });

  describe('login', () => {
    it('should login a user if it exist', async () => {
      const email = 'test@test.com';
      const user: AuthUser = {
        id: 1,
        email,
      };

      const result = await service.login(user);
      expect(userServiceMock.findOne).toHaveBeenCalled();
      expect(userServiceMock.findOne).toHaveBeenCalledWith(email);
      expect(result.accessToken).toBeTruthy();
    });

    it('should throw an error if the user does not exist', async () => {
      const email = 'hackerman@test.com';
      const user: AuthUser = {
        id: 1,
        email,
      };

      await expect(service.login(user)).rejects.toThrow(AuthenticationError);
    });
  });

  describe('login', () => {
    it('should refresh a user if it exist', async () => {
      const email = 'test@test.com';
      const user: AuthUser = {
        id: 1,
        email,
      };

      const result = await service.login(user);
      expect(userServiceMock.findOne).toHaveBeenCalled();
      expect(userServiceMock.findOne).toHaveBeenCalledWith(email);
      expect(result.accessToken).toBeTruthy();
    });

    it('should throw an error if the user is not registered.', async () => {
      const email = 'hackerman@test.com';
      const user: AuthUser = {
        id: 1,
        email,
      };

      await expect(service.login(user)).rejects.toThrow(AuthenticationError);
    });

    it('should throw an error if the user is invalid.', async () => {
      let user: AuthUser = {} as AuthUser;

      await expect(service.login(user)).rejects.toThrow(AuthenticationError);

      user = {
        email: null,
      } as AuthUser;
      await expect(service.login(user)).rejects.toThrow(AuthenticationError);
    });
  });

  describe('refreshToken', () => {
    it('should refresh the user token', async () => {
      // Going to leave this one empty for now. There still some work to do such
      // as persisting the token in the user table so for now I just want bare
      // bones functionality.
      expect(true).toBe(true);
    });
  });
});
