import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Session } from './entities/session.entity';
import { UsersModule } from '../users/users.module';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret: string | undefined =
          configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error(
            'JWT_SECRET no está definido en las variables de entorno',
          );
        }
        return {
          secret,
          signOptions: { expiresIn: '10m' },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ApiKeyGuard, AuthGuard],
  exports: [AuthService, ApiKeyGuard, AuthGuard],
})
export class AuthModule {}
