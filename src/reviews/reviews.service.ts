import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Dish } from 'src/dish/entities/dish.entity';
import { User } from 'src/users/entities/user.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';
import { UpdateReviewDto } from './dto/update-review.dto';
import { TWENTY_FOUR_HOURS } from 'src/utils/constant';

type DishWithoutRestaurantId = Omit<Dish, 'restaurantId'>;

type RestaurantWithModifiedDishes = Omit<Restaurant, 'dishes'> & {
  dishes: DishWithoutRestaurantId[];
};
@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  private async findOneAndValidateReviewOwnership(
    reviewId: string,
    currentUser: User,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['author'],
    });

    if (!review) throw new NotFoundException('Review not found.');

    if (review.author.id !== currentUser.id)
      throw new ForbiddenException('You do not own this review.');

    return review;
  }

  async create(
    createReviewDto: CreateReviewDto,
    author: User,
    restaurant: Restaurant | RestaurantWithModifiedDishes,
  ): Promise<Review> {
    const existingReview = await this.reviewRepository.findOne({
      where: {
        author: { id: author.id },
        restaurant: { id: restaurant.id },
      },
    });

    if (existingReview)
      throw new BadRequestException(
        'You have already reviewed this restaurant.',
      );

    const newReview = this.reviewRepository.create({
      ...createReviewDto,
      author,
      restaurant,
    });

    return this.reviewRepository.save(newReview);
  }

  async update(
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
    currentUser: User,
  ): Promise<Review> {
    const review = await this.findOneAndValidateReviewOwnership(
      reviewId,
      currentUser,
    );
    const timeReviewCreated =
      new Date().getTime() - new Date(review.createdAt).getTime();

    if (timeReviewCreated > TWENTY_FOUR_HOURS)
      throw new ForbiddenException(
        'You can only edit your review within 24 hours of posting it.',
      );

    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  async remove(reviewId: string, currentUser: User): Promise<void> {
    const review = await this.findOneAndValidateReviewOwnership(
      reviewId,
      currentUser,
    );

    await this.reviewRepository.remove(review);
  }

  async findAllForRestaurant(restaurantId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { restaurant: { id: restaurantId } },
      order: { createdAt: 'DESC' },
      relations: ['author', 'restaurant'],
    });
  }
}
