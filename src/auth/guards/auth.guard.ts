import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';

interface RequestWithUser extends Request {
  user: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private apiKeyGuard: ApiKeyGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Primero validamos el API Key
    const isApiKeyValid = this.apiKeyGuard.canActivate(context);
    if (!isApiKeyValid) {
      throw new UnauthorizedException('API Key inválida');
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    // Validar JWT Token
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'No se proporcionó token o el formato es inválido',
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No se proporcionó token');
    }

    const { isValid, user } = await this.authService.validateSession(token);
    if (!isValid || !user) {
      throw new UnauthorizedException('Sesión inválida');
    }

    request.user = user;
    return true;
  }
}
