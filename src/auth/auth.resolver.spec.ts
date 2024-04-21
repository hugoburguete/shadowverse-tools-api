import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { RefreshTokenArgs } from './dto/refresh-token.args';
import { RegisterArgs } from './dto/register.args';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  const authServiceMock = {
    login: jest.fn(),
    register: jest.fn(),
    refreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('login', () => {
    it("should call authService's login function", () => {
      const email = 'test@test.com';
      const user = { id: 1, email: email };
      resolver.login(email, 'secret', user);

      expect(authServiceMock.login).toHaveBeenCalled();
      expect(authServiceMock.login).toHaveBeenCalledWith(user);
    });
  });

  describe('register', () => {
    it("should call authService's register function", () => {
      const password = 'secret';
      const args: RegisterArgs = {
        name: 'New User',
        email: 'test@test.com',
        password,
        confirmPassword: password,
      };
      resolver.register(args);

      expect(authServiceMock.register).toHaveBeenCalled();
      expect(authServiceMock.register).toHaveBeenCalledWith(args);
    });
  });

  describe('refreshToken', () => {
    it("should call authService's refreshToken function", () => {
      const args: RefreshTokenArgs = {
        refreshToken: 'secret',
      };
      const user = { id: 1, email: 'test@test.com' };
      resolver.refreshToken(args, user);

      expect(authServiceMock.refreshToken).toHaveBeenCalled();
      expect(authServiceMock.refreshToken).toHaveBeenCalledWith(user);
    });
  });
});
