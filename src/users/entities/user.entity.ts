import { Exclude, Expose } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../enums/user-role';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Entity()
export class User {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty({
    example: 'John Doe',
    enum: [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.OWNER],
    default: UserRole.CUSTOMER,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  @Expose()
  role: UserRole;

  @ApiProperty({ example: 20000.0 })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @Expose()
  balance: number;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  restaurants: Restaurant[];

  @OneToMany(() => Review, (review) => review.author)
  @Expose()
  reviews: Review[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeInsert()
  @BeforeUpdate()
  adjustBalanceBasedOnRole() {
    if (this.role !== UserRole.CUSTOMER) this.balance = 0;
  }
}
