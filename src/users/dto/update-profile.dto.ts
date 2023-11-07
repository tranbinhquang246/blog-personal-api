import { IsString } from 'class-validator';

export class UpdateInfoDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
