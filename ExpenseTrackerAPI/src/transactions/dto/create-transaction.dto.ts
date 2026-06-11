import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min, MaxLength } from 'class-validator';
import { TransactionType } from '../schemas/transaction.schema';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsString()
  category: string; // ID категории придет строкой

  @IsNumber()
  @Min(0.01)
  @Type(() => Number) // Превращаем строку из JSON в число
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsDateString()
  date: string; // Дата придет строкой ISO
}