import { IsOptional, IsString } from 'class-validator';

export class CreateSummaryDto {
  @IsString()
  dateFrom?: string;

  @IsString()
  dateTo?: string;
}