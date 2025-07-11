import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role';
import { User } from 'src/users/entities/user.entity';
import { HttpStatus } from 'src/utils/httpStatus';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Restaurants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new restaurant (Owner only)' })
  @ApiBody({ type: CreateRestaurantDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Restaurant created successfully',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only users with role OWNER can access this endpoint',
  })
  create(@Request() req, @Body() createRestaurantDto: CreateRestaurantDto) {
    const owner: User = req.user;
    return this.restaurantService.create(owner, createRestaurantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiResponse({
    status: HttpStatus.SUCCESS,
    description: 'List of all restaurants',
  })
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID of the restaurant',
  })
  @ApiResponse({
    status: HttpStatus.SUCCESS,
    description: 'Restaurant data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant not found',
  })
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update restaurant by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID of the restaurant',
  })
  @ApiBody({ type: UpdateRestaurantDto })
  @ApiResponse({
    status: HttpStatus.SUCCESS,
    description: 'Restaurant updated successfully',
  })
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.SUCCESS)
  @ApiOperation({ summary: 'Delete restaurant by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID of the restaurant',
  })
  @ApiResponse({
    status: HttpStatus.SUCCESS,
    description: 'Restaurant deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant not found',
  })
  remove(@Param('id') id: string) {
    return this.restaurantService.remove(id);
  }
}
