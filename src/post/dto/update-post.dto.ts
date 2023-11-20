import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  content: string;

  @IsObject()
  categoryPostId: {
    id: string;
    category: string;
  };

  @IsArray()
  tag: string[];
}
