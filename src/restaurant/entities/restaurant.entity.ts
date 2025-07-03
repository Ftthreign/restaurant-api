import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Dish } from 'src/dish/entities/dish.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'text', array: true, default: [] })
  cuisines: string[];

  @Column({ default: true })
  isOpen: boolean;

  @OneToMany(() => Dish, (dish: Dish) => dish.restaurant)
  dishes: Dish[];
}
