import { Length, IsUrl } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { CommonEntity } from 'src/utils/entities/common.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Entity, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';

@Entity('wishes')
export class Wish extends CommonEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'numeric',
    scale: 2,
  })
  price: number;

  @Column({
    type: 'numeric',
    scale: 2,
    default: 0,
  })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    type: 'int',
    default: 0,
  })
  copied: number;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist[];
}
