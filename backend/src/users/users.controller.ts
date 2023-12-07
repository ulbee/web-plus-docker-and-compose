import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Req,
  Logger,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    this.logger = new Logger(UsersController.name);
  }

  private readonly logger: Logger;

  @Get('me/wishes')
  async showMyWishes(@Req() req) {
    return await this.usersService.findWishes(req.user.username);
  }

  @Get('me')
  async showUserProfile(@Req() req) {
    return await this.usersService.findByUsernameWithoutPassword(
      req.user.username,
    );
  }

  @Patch('me')
  async editUserProfile(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.update(req.user.username, updateUserDto);
  }

  @Get(':username/wishes')
  async showUserWishes(@Param('username') username: string) {
    return await this.usersService.findWishes(username);
  }

  @Get(':username')
  async findByUsername(@Param('username') username: string) {
    return await this.usersService.findByUsernameWithoutPassword(username);
  }

  @Post('find')
  async findManyByUsernameOrEmail(@Body() data: { query: string }) {
    return await this.usersService.findManyByUsernameOrEmail(data.query);
  }
}
