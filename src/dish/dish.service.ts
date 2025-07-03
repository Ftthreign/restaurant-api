import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { Repository } from 'typeorm';
import { defaultResponse } from 'src/utils/defaultResponse';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
  ) {}

  async create(createDishDto: CreateDishDto): Promise<Dish> {
    const newDish = this.dishRepository.create(createDishDto);
    return this.dishRepository.save(newDish);
  }

  async findAll(): Promise<Dish[] | defaultResponse> {
    const dishes = await this.dishRepository.find(); // tidak lagi include relasi restaurant

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

  async update(id: string, updateDishDto: UpdateDishDto): Promise<Dish> {
    const dish = await this.findOne(id);

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
