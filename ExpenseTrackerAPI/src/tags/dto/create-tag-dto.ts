import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ example: 'Срочные покупки', description: 'Название тега (2-30 символов)' })
  @IsString()
  @MinLength(2, { message: 'Tag name must be between 2 and 30 characters' })
  @MaxLength(30, { message: 'Tag name must be between 2 and 30 characters' })
  name: string;
}