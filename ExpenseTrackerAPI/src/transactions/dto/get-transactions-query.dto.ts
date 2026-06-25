import { IsOptional, IsIn, IsInt, Min, IsDateString, IsEnum, IsString, IsArray, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '../schemas/transaction.schema';
import { ApiPropertyOptional } from '@nestjs/swagger'; 

export class GetTransactionsQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @IsInt() @Min(1) @Type(() => Number) page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional() @IsInt() @Min(1) @Type(() => Number) limit?: number = 20;

  @ApiPropertyOptional({ example: 'кафе' })
  @IsOptional() @IsString() search?: string;

  @ApiPropertyOptional({ enum: TransactionType })
  @IsOptional() @IsEnum(TransactionType, { message: 'type must be "income" or "expense"' }) type?: TransactionType;

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsOptional() @IsString() categoryId?: string;

  @ApiPropertyOptional({ example: '2025-10-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString({}, { message: 'dateFrom must be a valid ISO 8601 date string' })
  dateFrom?: string; 

  @ApiPropertyOptional({ example: '2025-10-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString({}, { message: 'dateTo must be a valid ISO 8601 date string' })
  dateTo?: string; 

  @ApiPropertyOptional({
    description: 'Filter by tag IDs (returns transactions that have at least one of these tags). Use multiple tags= parameters.',
    type: 'string',
    isArray: true,
    example: ['6a3cfc897ff64e4a560c5b4b', '6a3cfc897ff64e4a560c5b4c']
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true, message: 'Each tag ID must be a valid MongoDB ObjectId' })
  tags?: string[];

  @ApiPropertyOptional({ 
    enum: ['date', 'amount'], 
    default: 'date',
    description: 'Field to sort by'
  })
  @IsOptional()
  @IsIn(['date', 'amount'], { message: 'sortBy can only be "date" or "amount"' }) 
  sortBy?: string = 'date';

  @ApiPropertyOptional({ 
    enum: ['asc', 'desc'], 
    default: 'desc',
    description: 'Sort order'
  })
  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'sortOrder can only be "asc" or "desc"' }) 
  sortOrder?: 'asc' | 'desc' = 'desc';
}