import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger'; 

export class GetSummaryQueryDto {
  @ApiPropertyOptional({ example: '2023-10-01T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2023-10-31T23:59:59.000Z' })
  @IsOptional()
  @IsString()
  dateTo?: string;
}