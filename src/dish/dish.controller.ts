import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Dishes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('restaurant/:restaurantId/dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new dish for a restaurant' })
  @ApiParam({
    name: 'restaurantId',
    type: 'string',
    description: 'UUID of the restaurant',
  })
  @ApiBody({ type: CreateDishDto })
  @ApiResponse({
    status: 201,
    description: 'Dish created successfully',
  })
  create(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Body() createDishDto: CreateDishDto,
    @Request() req,
  ) {
    const currentUser = req.user;
    return this.dishService.create(restaurantId, createDishDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Get all dishes for a restaurant' })
  @ApiParam({
    name: 'restaurantId',
    type: 'string',
    description: 'UUID of the restaurant',
  })
  @ApiResponse({
    status: 200,
    description: 'List of dishes',
  })
  findAll(@Param('restaurantId', ParseUUIDPipe) restaurantId: string) {
    return this.dishService.findAll(restaurantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific dish by its ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the dish' })
  @ApiResponse({
    status: 200,
    description: 'Dish data',
  })
  @ApiResponse({
    status: 404,
    description: 'Dish not found',
  })
  findOne(@Param('id') id: string) {
    return this.dishService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a dish by its ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the dish' })
  @ApiBody({ type: UpdateDishDto })
  @ApiResponse({
    status: 200,
    description: 'Dish updated successfully',
  })
  update(
    @Param('id') id: string,
    @Body() updateDishDto: UpdateDishDto,
    @Request() req,
  ) {
    return this.dishService.update(id, updateDishDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a dish by its ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID of the dish' })
  @ApiResponse({
    status: 200,
    description: 'Dish deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.dishService.remove(id);
  }
}
