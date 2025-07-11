import { IsString, IsNotEmpty, IsUUID, Min, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDishDto {
  @ApiPropertyOptional({
    example: 'Nasi Goreng Spesial',
    description: 'Nama hidangan (opsional, dapat diisi oleh sistem)',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Nasi goreng dengan ayam dan telur',
    description: 'Deskripsi hidangan (opsional)',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 25000,
    description: 'Harga hidangan (wajib, dalam rupiah)',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({
    example: 'ee92f75d-798e-4d5a-b6db-cc8ee408b4fb',
    description: 'UUID restoran tempat hidangan ini tersedia',
  })
  @IsUUID()
  @IsNotEmpty()
  restaurantId: string;
}
