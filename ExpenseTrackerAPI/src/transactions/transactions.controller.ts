import { Controller, Get, Post, Patch, Body, Param, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto'; 
import { GetTransactionsQueryDto } from './dto/get-transactions-query.dto';
import { UpdateTransactionDto } from './dto/update-transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post() create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get() findAll(@Query() query: GetTransactionsQueryDto) {
    return this.transactionsService.findAll(query);
  }

  @Get(':id') findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, updateDto);
  }

  @Delete(':id') remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
}