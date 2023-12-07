import { User } from 'src/users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from 'src/utils/entities/common.entity';

@Entity('offers')
export class Offer extends CommonEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({
    type: 'numeric',
    scale: 2,
  })
  amount: number;

  @Column({
    default: false,
  })
  hidden: boolean;
}
