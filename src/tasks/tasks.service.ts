import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { TaskResponse } from './types/task-response.type';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(title: string, description: string, user: User): Promise<Task> {
    const task = this.tasksRepository.create({
      title,
      description,
      user,
    });
    return this.tasksRepository.save(task);
  }

  async findAll(user: User): Promise<TaskResponse[]> {
    const tasks = await this.tasksRepository.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });

    return tasks.map((task) => {
      const { user, ...taskWithoutUser } = task;
      return {
        ...taskWithoutUser,
        idUser: user.id,
      };
    });
  }

  async findOne(id: string, user: User): Promise<TaskResponse> {
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const { user: taskUser, ...taskWithoutUser } = task;
    return {
      ...taskWithoutUser,
      idUser: taskUser.id,
    };
  }

  async update(
    id: string,
    title: string,
    description: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.findOne(id, user);

    task.title = title;
    task.description = description;
    task.status = status;

    return this.tasksRepository.save(task);
  }

  async remove(id: string, user: User): Promise<void> {
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.tasksRepository.remove(task);
  }
}
