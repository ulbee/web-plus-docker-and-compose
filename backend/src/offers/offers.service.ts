import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';

import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';

import { CANT_OFFER_PRICE, CANT_OFFER_MORE } from '../constants/offers';

@Injectable()
export class OffersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    this.logger = new Logger(OffersService.name);
  }
  private readonly logger: Logger;

  async create(createOfferDto: CreateOfferDto, userId) {
    const wish = await this.wishesRepository.findOne({
      where: {
        id: createOfferDto.item,
      },
      relations: {
        owner: true,
      },
    });

    if (wish.owner.id === userId) {
      throw new ForbiddenException(CANT_OFFER_PRICE);
    }
    if (createOfferDto.amount > wish.price - wish.raised) {
      throw new BadRequestException(CANT_OFFER_MORE);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.offersRepository.save({
        ...createOfferDto,
        user: userId,
        item: wish,
      });

      await this.wishesRepository.update(wish.id, {
        raised: +wish.raised + +createOfferDto.amount,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error('EOOEO ' + err.message);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return {};
  }

  //TODO удалить password из ответа
  async findAll() {
    return await this.offersRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.offersRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });
  }
}
