import { Transform } from 'class-transformer';
import { IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class FilterPostDto {
  @IsString()
  search: string;

  @IsString()
  category: string;

  @IsString()
  tag: string;

  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @Min(1)
  @IsPositive()
  page: number;
}
