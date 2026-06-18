import { Controller, Get, Query } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { GetSummaryQueryDto } from './dto/get-summary-query.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Summary') 
@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get()
  @ApiOperation({ summary: 'Get income, expense and balance summary for a period' })
  getSummary(@Query() query: GetSummaryQueryDto) {
    return this.summaryService.getSummary(query.dateFrom, query.dateTo);
  }
}