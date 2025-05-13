import { Task, TaskStatus } from '../entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export type TaskResponse = Omit<Task, 'user'> & { idUser: string };

export class TaskResponseDto implements TaskResponse {
  @ApiProperty({ example: '87c7497f-ab5a-4036-8cd9-75527bac4285' })
  id: string;

  @ApiProperty({ example: 'Completar informe mensual' })
  title: string;

  @ApiProperty({
    example:
      'Necesito completar el informe mensual de ventas antes del viernes',
  })
  description: string;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ApiProperty({ example: '2025-05-11T04:50:22.120Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-11T04:50:22.120Z' })
  updatedAt: Date;

  @ApiProperty({ example: '38d2c8ff-6bd6-4b06-8d0d-e0e1ad9f4456' })
  idUser: string;
}

export class ApiResponseDto<T> {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Operación exitosa' })
  message: string;

  @ApiProperty()
  data: T;
}

export class TaskListResponseDto extends ApiResponseDto<TaskResponseDto[]> {}
export class SingleTaskResponseDto extends ApiResponseDto<TaskResponseDto> {}
