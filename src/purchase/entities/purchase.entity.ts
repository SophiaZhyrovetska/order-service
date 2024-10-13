import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Offer } from '../../offer/entities/offer.entity';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.purchases)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Offer, (offer) => offer.purchases)
  @JoinColumn({ name: 'offer_id' })
  offer?: Offer;
}
