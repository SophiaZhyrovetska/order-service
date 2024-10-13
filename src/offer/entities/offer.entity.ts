import { IsDecimal, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from '../../purchase/entities/purchase.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @Column('decimal')
  @IsDecimal()
  price: number;

  @OneToMany(() => Purchase, (purchase) => purchase.offer)
  purchases?: Purchase[];
}
