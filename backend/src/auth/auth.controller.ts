import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Logger,
  SetMetadata,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from '../guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    this.logger = new Logger(AuthController.name);
  }

  private readonly logger: Logger;

  @SetMetadata('isPublic', true)
  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req) {
    return await this.authService.auth(req.user);
  }

  @SetMetadata('isPublic', true)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    delete user.password;

    return user;
  }
}
