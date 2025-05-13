import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ResponseMessageService } from './common/services/response-message.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS para los origins deseados
  app.enableCors({
    origin: `http://localhost:${process.env.PORT ?? 3000}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Obtener la instancia del servicio de mensajes
  const messageService = app.get(ResponseMessageService);

  // Aplicar el interceptor de transformación global con el servicio
  app.useGlobalInterceptors(new TransformInterceptor(messageService));

  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('API para gestión de tareas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
