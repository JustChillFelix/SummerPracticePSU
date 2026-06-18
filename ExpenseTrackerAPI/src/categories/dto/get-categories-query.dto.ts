import { IsOptional, IsIn, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger'; 

export class GetCategoriesQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: 'Items per page' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional({ example: 'Еда', description: 'Search by name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ 
    enum: ['name', 'createdAt'], 
    default: 'name',
    description: 'Field to sort by'
  })
  @IsOptional()
  @IsIn(['name', 'createdAt'], { message: 'sortBy can only be "name" or "createdAt"' })
  sortBy?: string = 'name';

  @ApiPropertyOptional({ 
    enum: ['asc', 'desc'], 
    default: 'asc',
    description: 'Sort order'
  })
  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'sortOrder can only be "asc" or "desc"' })
  sortOrder?: 'asc' | 'desc' = 'asc';
}