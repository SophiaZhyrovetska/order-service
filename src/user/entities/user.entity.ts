import { IsEmail, IsObject, IsOptional } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from '../../purchase/entities/purchase.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column('jsonb', { nullable: true, name: 'marketing_data' })
  @IsOptional()
  @IsObject()
  marketingData: Record<string, any>;

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases?: Purchase[];
}
