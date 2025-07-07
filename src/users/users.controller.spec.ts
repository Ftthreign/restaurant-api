import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './enums/user-role';

const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
};

describe('UsersController test case', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideInterceptor(ClassSerializerInterceptor)
      .useValue({ intercept: (ctx, next) => next.handle() })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create users account', () => {
    it('should create a user account', async () => {
      const createUserDto: CreateUserDto = {
        name: 'testing user',
        email: 'testuser@ex.co',
        password: 'test1234',
      };

      const expectedResult = {
        id: 'uuid-placeholder',
        name: 'testing user',
        email: 'testuser@ex.co',
        role: UserRole.CUSTOMER,
      };

      mockUsersService.create.mockResolvedValue(expectedResult);

      const res = await controller.create(createUserDto);

      expect(res).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });
});
