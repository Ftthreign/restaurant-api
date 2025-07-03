import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
  IsNumber,
} from 'class-validator';

export class CreateDishDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsUUID()
  @IsNotEmpty()
  restaurantId: string;
}
