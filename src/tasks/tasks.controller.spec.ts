import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskStatus } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    idUser: mockUser.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTaskWithUser = {
    ...mockTask,
    user: mockUser,
  };

  const mockRequest = {
    user: mockUser,
  };

  const mockTaskRepository = {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: AuthService,
          useValue: {
            validateSession: jest.fn(),
          },
        },
        {
          provide: ApiKeyGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  describe('create', () => {
    it('debería crear una nueva tarea', async () => {
      const createTaskDto = {
        title: 'Tarea de prueba',
        description: 'Descripción de prueba',
      };

      const createSpy = jest
        .spyOn(tasksService, 'create')
        .mockResolvedValue(mockTaskWithUser);

      const result = await controller.create(createTaskDto, mockRequest);

      expect(result).toEqual(mockTaskWithUser);
      expect(createSpy).toHaveBeenCalledWith(
        createTaskDto.title,
        createTaskDto.description,
        mockUser,
      );
    });
  });

  describe('findAll', () => {
    it('debería retornar un array de tareas', async () => {
      const tasks = [mockTask];
      const findAllSpy = jest
        .spyOn(tasksService, 'findAll')
        .mockResolvedValue(tasks);

      const result = await controller.findAll(mockRequest);

      expect(result).toEqual(tasks);
      expect(findAllSpy).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findOne', () => {
    it('debería retornar una tarea por id', async () => {
      const findOneSpy = jest
        .spyOn(tasksService, 'findOne')
        .mockResolvedValue(mockTask);

      const result = await controller.findOne('1', mockRequest);

      expect(result).toEqual(mockTask);
      expect(findOneSpy).toHaveBeenCalledWith('1', mockUser);
    });

    it('debería lanzar NotFoundException cuando la tarea no se encuentra', async () => {
      jest
        .spyOn(tasksService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('999', mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('debería actualizar una tarea', async () => {
      const updateTaskDto = {
        title: 'Tarea Actualizada',
        description: 'Descripción Actualizada',
        status: TaskStatus.COMPLETED,
      };

      const updatedTask = { ...mockTaskWithUser, ...updateTaskDto };
      const updateSpy = jest
        .spyOn(tasksService, 'update')
        .mockResolvedValue(updatedTask);

      const result = await controller.update('1', updateTaskDto, mockRequest);

      expect(result).toEqual(updatedTask);
      expect(updateSpy).toHaveBeenCalledWith(
        '1',
        updateTaskDto.title,
        updateTaskDto.description,
        updateTaskDto.status,
        mockUser,
      );
    });

    it('debería lanzar NotFoundException cuando la tarea no se encuentra', async () => {
      const updateTaskDto = {
        title: 'Tarea Actualizada',
        description: 'Descripción Actualizada',
        status: TaskStatus.COMPLETED,
      };

      jest
        .spyOn(tasksService, 'update')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.update('999', updateTaskDto, mockRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar una tarea', async () => {
      const removeSpy = jest
        .spyOn(tasksService, 'remove')
        .mockResolvedValue(undefined);

      await controller.remove('1', mockRequest);

      expect(removeSpy).toHaveBeenCalledWith('1', mockUser);
    });

    it('debería lanzar NotFoundException cuando la tarea no se encuentra', async () => {
      jest
        .spyOn(tasksService, 'remove')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.remove('999', mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
