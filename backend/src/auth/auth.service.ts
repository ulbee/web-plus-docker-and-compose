import { Injectable, Logger } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  private readonly logger: Logger;

  auth(user: User) {
    const payload = { sub: user.username };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt_secret'),
      }),
    };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsernameWithPassword(username);

    if (!user) {
      return null;
    }

    return await bcrypt
      .compare(String(password), user.password)
      .then((matched) => {
        if (!matched) {
          return null;
        }
        delete user.password;
        return user;
      });
  }
}
