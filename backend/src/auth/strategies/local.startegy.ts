import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AUTH_WRONG_CREDENTIALS } from '../../constants/auth';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();

    this.logger = new Logger(LocalStrategy.name);
  }

  private readonly logger: Logger;

  async validate(username: string, password: string) {
    const user = await this.authService.validatePassword(username, password);

    if (!user) {
      throw new UnauthorizedException(AUTH_WRONG_CREDENTIALS);
    }

    return user;
  }
}
