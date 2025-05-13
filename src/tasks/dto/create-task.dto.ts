import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título de la tarea',
    example: 'Completar informe mensual',
    minLength: 3,
    maxLength: 100,
  })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El título no puede tener más de 100 caracteres' })
  title: string;

  @ApiProperty({
    description: 'Descripción detallada de la tarea',
    example:
      'Necesito completar el informe mensual de ventas antes del viernes',
    required: false,
    maxLength: 500,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(500, {
    message: 'La descripción no puede tener más de 500 caracteres',
  })
  description?: string;
}
