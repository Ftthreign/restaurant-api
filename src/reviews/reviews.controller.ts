import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/enums/user-role';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateReviewDto } from './dto/update-review.dto';
import { HttpStatus } from 'src/utils/httpStatus';
import { HttpCode } from '@nestjs/common/decorators';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('restaurant/:restaurantId/reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly restaurantService: RestaurantService,
  ) {}

  @ApiOperation({ summary: 'Create a review for a restaurant' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The review has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request. The input data is invalid.',
  })
  @ApiBody({ type: CreateReviewDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Post()
  async create(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Request() req,
  ) {
    const author: User = req.user;
    const restaurant = await this.restaurantService.findOne(restaurantId);
    return this.reviewsService.create(createReviewDto, author, restaurant);
  }

  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({
    status: HttpStatus.SUCCESS,
    description: 'The review has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Review not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'You do not own this review.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':reviewId')
  async update(
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req,
  ) {
    const currentUser: User = req.user;
    return this.reviewsService.update(reviewId, updateReviewDto, currentUser);
  }

  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The review has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Review not found.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':reviewId')
  async remove(
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Request() req,
  ) {
    const currentUser: User = req.user;
    return this.reviewsService.remove(reviewId, currentUser);
  }

  @ApiOperation({ summary: 'Get all reviews for a restaurant' })
  @ApiResponse({
    status: HttpStatus.SUCCESS,
    description: 'Returns an array of reviews for the restaurant.',
    type: [CreateReviewDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant not found.',
  })
  @ApiBody({ type: CreateReviewDto })
  @ApiBearerAuth()
  @Get()
  findAll(@Param('restaurantId', ParseUUIDPipe) restaurantId: string) {
    return this.reviewsService.findAllForRestaurant(restaurantId);
  }
}
