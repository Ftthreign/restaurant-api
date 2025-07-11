import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Review {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty({ example: 'Great food and service!' })
  reviewDescription: string;

  @Column()
  @IsInt()
  @Min(1)
  @Max(5)
  @ApiProperty({ example: 5, description: 'Rating from 1 to 5' })
  rating: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2023-10-01T12:00:00Z' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reviews, { eager: true })
  author: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews)
  restaurant: Restaurant;
}
