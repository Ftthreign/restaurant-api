import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  desription: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.dishes, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;
}
