import {
  IsBoolean,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty({ description: 'Nama restoran', example: 'Sate Pak Bondan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Alamat restoran',
    example: 'Jl. Soekarno Hatta No.10',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Jenis masakan yang disediakan',
    example: ['Indonesia', 'Jepang'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cuisines?: string[];

  @ApiPropertyOptional({
    description: 'Status buka/tutup restoran',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isOpen?: boolean;
}
