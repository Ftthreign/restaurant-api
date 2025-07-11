import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { Repository } from 'typeorm';
import { defaultResponse } from 'src/utils/defaultResponse';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
    private readonly restaurantService: RestaurantService,
  ) {}

  async create(
    restaurantId: string,
    createDishDto: CreateDishDto,
    currentUser: User,
  ): Promise<Dish> {
    const validateRestaurant =
      await this.restaurantService.findOneById(restaurantId);
    const newDish = this.dishRepository.create({
      ...createDishDto,
      restaurant: validateRestaurant,
    });

    if (validateRestaurant.owner.id !== currentUser.id)
      throw new ForbiddenException(
        'You are not allowed to create a dish for this restaurant',
      );

    return this.dishRepository.save(newDish);
  }

  async findAll(restaurantId: string): Promise<Dish[] | defaultResponse> {
    const validateRestaurant =
      await this.restaurantService.findOneById(restaurantId);

    const dishes = await this.dishRepository.find({
      where: {
        restaurant: { id: validateRestaurant.id },
      },
    });

    if (dishes.length === 0) {
      return {
        status: 'success',
        message: 'Dishes data',
        data: [],
      };
    }

    return dishes;
  }

  async findOne(id: string): Promise<Dish> {
    const dish = await this.dishRepository.findOne({ where: { id } });

    if (!dish) {
      throw new NotFoundException(`Dish with id ${id} not found`);
    }

    return dish;
  }

  async update(
    id: string,
    updateDishDto: UpdateDishDto,
    currentUser: User,
  ): Promise<Dish> {
    const dish = await this.findOne(id);

    if (dish.restaurant.owner.id !== currentUser.id) {
      throw new ForbiddenException('You are not allowed to update this dish');
    }

    this.dishRepository.merge(dish, updateDishDto);
    return this.dishRepository.save(dish);
  }

  async remove(id: string): Promise<void> {
    const res = await this.dishRepository.delete(id);

    if (res.affected === 0) {
      throw new NotFoundException(`Dish with id ${id} not found`);
    }
  }
}
