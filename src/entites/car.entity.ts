import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  make: string;

  @Column()
  description: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  price: number;
}
