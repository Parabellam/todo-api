import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './entities/task.entity';
import {
  TaskResponse,
  TaskListResponseDto,
  SingleTaskResponseDto,
} from './types/task-response.type';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: { user: User },
  ): Promise<Task> {
    return this.tasksService.create(
      createTaskDto.title,
      createTaskDto.description || '',
      req.user,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las tareas del usuario autenticado' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Lista de tareas obtenida exitosamente',
    type: TaskListResponseDto,
  })
  async findAll(@Req() req: { user: User }): Promise<TaskResponse[]> {
    return this.tasksService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarea por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la tarea' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Tarea encontrada exitosamente',
    type: SingleTaskResponseDto,
  })
  async findOne(
    @Param('id') id: string,
    @Req() req: { user: User },
  ): Promise<TaskResponse> {
    return this.tasksService.findOne(id, req.user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una tarea existente' })
  @ApiParam({ name: 'id', description: 'ID de la tarea' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: { user: User },
  ): Promise<Task> {
    return this.tasksService.update(
      id,
      updateTaskDto.title || '',
      updateTaskDto.description || '',
      updateTaskDto.status || TaskStatus.PENDING,
      req.user,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiParam({ name: 'id', description: 'ID de la tarea' })
  async remove(
    @Param('id') id: string,
    @Req() req: { user: User },
  ): Promise<void> {
    return this.tasksService.remove(id, req.user);
  }
}
