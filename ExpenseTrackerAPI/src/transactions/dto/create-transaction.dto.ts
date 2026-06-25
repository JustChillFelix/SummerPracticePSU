import { IsString, IsNumber, IsEnum, IsOptional, IsDate, Min, MaxLength, IsArray, IsMongoId } from 'class-validator';
import { TransactionType } from '../schemas/transaction.schema'; 
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Category ID' })
  @IsString()
  category: string;

  @ApiProperty({ example: 150.50 })
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional({ example: 'Dinner in cafe', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ example: '2025-10-25T12:00:00.000Z' })
  @IsDate({ message: 'date must be a valid date' })
  @Type(() => Date) 
  date: Date;

  @ApiPropertyOptional({ type: [String], description: 'Массив ID тегов' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true, message: 'Each tag ID must be a valid MongoDB ObjectId' })
  tags?: string[];
}