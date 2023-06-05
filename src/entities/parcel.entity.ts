import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('parcel')
export class Parcel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sku: string;

  @Column()
  description: string;

  @Column()
  streetAddress: string;

  @Column()
  town: string;

  @Column()
  country: string;

  @Column()
  deliveryDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
