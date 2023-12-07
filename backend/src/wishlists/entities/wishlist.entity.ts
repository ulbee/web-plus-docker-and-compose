import { Length, IsUrl, MaxLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { CommonEntity } from 'src/utils/entities/common.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Entity, Column, ManyToMany, ManyToOne, JoinTable } from 'typeorm';

@Entity('wishlists')
export class Wishlist extends CommonEntity {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @MaxLength(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.id)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
