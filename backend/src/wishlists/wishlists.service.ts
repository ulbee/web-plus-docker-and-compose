import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { NOT_FOUND_WISHLIST, NOT_ENOUGH_RIGHTS } from '../constants/wishlists';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, user) {
    const wishes = await this.wishesRepository.find({
      where: {
        id: In([...createWishlistDto.items]),
      },
    });

    return await this.wishlistsRepository.save({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
  }

  async findAll() {
    return await this.wishlistsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException(NOT_FOUND_WISHLIST);
    }

    return wishlist;
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto, userId) {
    const wishlist = await this.findOne(id);
    const updatedWishlist = { ...updateWishlistDto };
    if (!wishlist) {
      throw new NotFoundException(NOT_FOUND_WISHLIST);
    }
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(NOT_ENOUGH_RIGHTS);
    }

    if (updateWishlistDto.items) {
      const wishes = await this.wishesRepository.find({
        where: {
          id: In([...updateWishlistDto.items]),
        },
      });
      updatedWishlist.items = wishes;
    }

    return await this.wishlistsRepository.save({
      id,
      ...updatedWishlist,
    });
  }

  async remove(id: number, userId) {
    const wishlist = await this.findOne(id);

    if (!wishlist) {
      throw new NotFoundException(NOT_FOUND_WISHLIST);
    }
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(NOT_ENOUGH_RIGHTS);
    }

    await this.wishlistsRepository.delete(id);
  }
}
