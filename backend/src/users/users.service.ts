import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { USER_EXIST, USER_NOT_EXIST } from 'src/constants/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    this.logger = new Logger(UsersService.name);
  }

  private readonly logger: Logger;
  private readonly hashSalt = 10;

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.usersRepository.find({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (userExists.length) {
      throw new ConflictException(USER_EXIST);
    }

    createUserDto.password = await bcrypt.hash(
      String(createUserDto.password),
      this.hashSalt,
    );

    return await this.usersRepository.save({
      ...createUserDto,
      offers: [],
      wishes: [],
      wishlists: [],
    });
  }

  async findManyByUsernameOrEmail(query: string) {
    return await this.usersRepository.find({
      where: [{ username: query }, { email: query }],
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        username: true,
        email: true,
        about: true,
        avatar: true,
      },
    });
  }

  async findByUsernameWithoutPassword(username: string) {
    return await this.usersRepository.findOne({
      where: {
        username,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        username: true,
        email: true,
        about: true,
        avatar: true,
      },
    });
  }

  async findByUsernameWithPassword(username: string) {
    const user = await this.usersRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException(USER_NOT_EXIST);
    }
    return user;
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        String(updateUserDto.password),
        this.hashSalt,
      );
    }
    await this.usersRepository.update({ username }, updateUserDto);

    return await this.findByUsernameWithoutPassword(username);
  }

  async findWishes(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['wishes', 'wishes.offers', 'wishes.offers.user'],
    });

    if (!user) {
      throw new NotFoundException(USER_NOT_EXIST);
    }

    return user.wishes;
  }
}
