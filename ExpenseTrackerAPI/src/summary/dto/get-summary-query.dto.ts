import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class GetSummaryQueryDto {
  @ApiPropertyOptional({ example: '2025-10-01T00:00:00.000Z', description: 'Начало периода (ISO формат)' })
  @IsOptional()
  @IsDateString() 
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2025-10-31T23:59:59.000Z', description: 'Конец периода (ISO формат)' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}