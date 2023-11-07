import { IsArray, IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  fullName: string;

  @IsString()
  aliasName: string;

  @IsString()
  introduction: string;

  @IsArray()
  @IsString({ each: true })
  reason: string[];

  @IsArray()
  @IsString({ each: true })
  target: string[];

  @IsArray()
  @IsString({ each: true })
  experience: string[];

  @IsArray()
  @IsString({ each: true })
  interest: string[];
}
