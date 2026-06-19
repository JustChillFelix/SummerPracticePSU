import { IsOptional, IsIn, IsInt, Min, IsString, IsEnum } from 'class-validator';
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
  @IsOptional() @IsString() dateFrom?: string;

  @ApiPropertyOptional({ example: '2025-10-31T23:59:59.000Z' })
  @IsOptional() @IsString() dateTo?: string;

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