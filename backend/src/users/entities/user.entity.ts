import { IsUrl, IsEmail, Length } from 'class-validator';
import { CommonEntity } from 'src/utils/entities/common.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { DEFAULT_USER_ABOUT, DEFAULT_USER_AVATAR } from 'src/constants/users';

@Entity('users')
export class User extends CommonEntity {
  @Column({
    unique: true,
  })
  @Length(2, 30)
  username: string;

  @Column({
    default: DEFAULT_USER_ABOUT,
  })
  @Length(2, 200)
  about: string;

  @Column({
    default: DEFAULT_USER_AVATAR,
  })
  @IsUrl()
  avatar: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.id)
  wishlists: Wishlist[];
}
