import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt_secret'),
    });

    this.logger = new Logger(JwtStrategy.name);
  }

  private readonly logger: Logger;

  async validate(jwtPayload: { sub: string }) {
    const user = await this.usersService.findByUsernameWithoutPassword(
      jwtPayload.sub,
    );

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
