import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  public item: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  public amount: number;

  @IsBoolean()
  @IsOptional()
  public hidden: boolean = false;
}
