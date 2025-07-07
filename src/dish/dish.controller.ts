import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { ParseUUIDPipe } from '@nestjs/common/pipes';

@Controller('restaurant/:restaurantId/dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  create(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Body() createDishDto: CreateDishDto,
  ) {
    return this.dishService.create(restaurantId, createDishDto);
  }

  @Get()
  findAll(@Param('restaurantId', ParseUUIDPipe) restaurantId: string) {
    return this.dishService.findAll(restaurantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    return this.dishService.update(id, updateDishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dishService.remove(id);
  }
}
