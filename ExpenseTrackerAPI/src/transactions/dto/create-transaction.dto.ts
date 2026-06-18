import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min, MaxLength } from 'class-validator';
import { TransactionType } from '../schemas/transaction.schema'; 
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsString()
  category: string;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsDateString()
  date: string;
}