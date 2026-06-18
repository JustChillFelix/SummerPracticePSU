import { IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Name must be between 2 and 50 characters' })
  @MaxLength(50, { message: 'Name must be between 2 and 50 characters' })
  name: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { 
    message: 'Color must be a valid HEX format (e.g., #FF5733)' 
  })
  color: string;
}