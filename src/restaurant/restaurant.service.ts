import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { Restaurant } from './entities/restaurant.entity';
import { defaultResponse } from 'src/utils/defaultResponse';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const newRestaurant = this.restaurantRepository.create(createRestaurantDto);
    return this.restaurantRepository.save(newRestaurant);
  }

  async findAll(): Promise<Restaurant[] | defaultResponse> {
    const restaurants = await this.restaurantRepository.find();

    if (restaurants.length === 0) {
      return {
        status: 'success',
        message: 'Restaurant data is empty',
        data: [],
      };
    }

    return restaurants;
  }

  async findOne(id: string): Promise<any> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['dishes'],
    });

    if (!restaurant)
      throw new NotFoundException(`Restaurant with id ${id} not found`);

    const { dishes, ...rest } = restaurant;

    const filteredData = dishes.map(({ restaurantId, ...dish }) => dish);

    return {
      ...rest,
      dishes: filteredData,
    };
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.findOne(id);

    this.restaurantRepository.merge(restaurant, updateRestaurantDto);

    return this.restaurantRepository.save(restaurant);
  }

  async remove(id: string): Promise<void> {
    const res = await this.restaurantRepository.delete(id);

    if (res.affected === 0)
      throw new NotFoundException(`Restaurant with id ${id} not found`);
  }
}
