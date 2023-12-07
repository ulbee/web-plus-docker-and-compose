import {
  IsOptional,
  IsUrl,
  Length,
  IsArray,
  IsNumber,
  MaxLength,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Wish } from '../../wishes/entities/wish.entity';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsOptional()
  @IsString()
  @MaxLength(1500)
  description: string = '';

  @Type(() => Wish)
  @IsArray()
  @IsNumber({}, { each: true })
  items: Wish[];
}
