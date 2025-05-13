import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Session } from './entities/session.entity';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.usersService.findByEmail(email);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Invalidar sesiones anteriores del usuario
    await this.sessionRepository.delete({ user: { id: user.id } });

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '10m',
    });

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await this.sessionRepository.save({
      token,
      user,
      expiresAt,
    });

    return { token };
  }

  async validateSession(
    token: string,
  ): Promise<{ isValid: boolean; user?: User }> {
    const session = await this.sessionRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!session) {
      return { isValid: false };
    }

    if (new Date() > session.expiresAt) {
      await this.sessionRepository.remove(session);
      return { isValid: false };
    }

    return { isValid: true, user: session.user };
  }
}
