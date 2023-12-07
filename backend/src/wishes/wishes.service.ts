import {
  ForbiddenException,
  NotFoundException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    this.logger = new Logger(WishesService.name);
  }
  private readonly logger: Logger;

  async create(createWishDto: CreateWishDto, userId) {
    return await this.wishesRepository.insert({
      ...createWishDto,
      owner: userId,
      offers: [],
    });
  }

  async findOne(id: number) {
    return await this.wishesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findWishBiId(id: number) {
    return await this.wishesRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async updateWishById(
    id: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ) {
    const wish = await this.findWishBiId(id);

    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете редактировать чужие подарки');
    }
    if (wish.raised > 0 && updateWishDto.price) {
      throw new ForbiddenException(
        'Вы не можете редактировать цену, если уже есть желающие скинуться',
      );
    }

    return await this.wishesRepository.update(id, updateWishDto);
  }

  async deleteWishById(id: number, userId: number) {
    const wish = await this.findWishBiId(id);

    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете удалять чужие подарки');
    }

    await this.wishesRepository.delete(id);
    return wish;
  }

  async copyWish(id: number, userId) {
    const { name, link, image, price, description, copied } =
      await this.findOne(id);

    await this.wishesRepository.update(id, { copied: copied + 1 });
    await this.create({ name, link, image, price, description }, userId);

    return {};
  }

  async findWishes(recordsOnPage: number, page: number) {
    const take = recordsOnPage;
    const skip = recordsOnPage * page;
    return await this.wishesRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take,
      skip,
    });
  }

  async findTopWishes(records: number) {
    return this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: records,
    });
  }
}
