import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Dish } from 'src/dish/entities/dish.entity';
import { User } from 'src/users/entities/user.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Restaurant {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'The Great Restaurant' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Jl. Kebangsaan no.2' })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ example: 'japanese' })
  @Column({ type: 'text', array: true, default: [] })
  cuisines: string[];

  @ApiProperty({ example: false })
  @Column({ default: true })
  isOpen: boolean;

  @OneToMany(() => Dish, (dish: Dish) => dish.restaurant)
  dishes: Dish[];

  @OneToMany(() => Review, (review) => review.restaurant)
  reviews: Review[];

  @ManyToOne(() => User, (user: User) => user.restaurants, { eager: false })
  owner: User;
}
