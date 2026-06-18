import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema }
    ]),
  ],
  controllers: [SummaryController],
  providers: [SummaryService],
})
export class SummaryModule {}