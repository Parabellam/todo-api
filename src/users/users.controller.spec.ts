import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un usuario exitosamente', async () => {
      const createUserDto: CreateUserDto = {
        email: 'nuevo@ejemplo.com',
        password: 'password123',
      };
      const expectedUser = {
        id: '1',
        email: createUserDto.email,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        tasks: [],
      };
      jest.spyOn(usersService, 'create').mockResolvedValue(expectedUser);

      const result = await controller.create(createUserDto);
      expect(result).toEqual(expectedUser);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.create).toHaveBeenCalledWith(
        createUserDto.email,
        createUserDto.password,
      );
    });

    it('debería lanzar ConflictException si el email ya existe', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existente@ejemplo.com',
        password: 'password123',
      };
      jest
        .spyOn(usersService, 'create')
        .mockRejectedValue(
          new ConflictException('El email ya está registrado'),
        );

      await expect(controller.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
