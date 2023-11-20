import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  tag: string[];

  @IsString()
  category: string;
}
