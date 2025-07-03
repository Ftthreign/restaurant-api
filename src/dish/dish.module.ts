import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dish]), RestaurantModule],
  controllers: [DishController],
  providers: [DishService],
})
export class DishModule {}
