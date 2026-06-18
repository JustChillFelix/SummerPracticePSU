import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionType } from '../transactions/schemas/transaction.schema';

@Injectable()
export class SummaryService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async getSummary(dateFrom?: string, dateTo?: string) {
    let startDate: Date;
    let endDate: Date;

    if (dateFrom && dateTo) {
      startDate = new Date(dateFrom);
      endDate = new Date(dateTo);
    } else {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); 
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); 
    }

    const result = await this.transactionModel.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', TransactionType.INCOME] }, '$amount', 0] }
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ['$type', TransactionType.EXPENSE] }, '$amount', 0] }
          }
        }
      }
    ]);

    const summary = result[0] || { totalIncome: 0, totalExpense: 0 };
    
    return {
      totalIncome: summary.totalIncome,
      totalExpense: summary.totalExpense,
      balance: summary.totalIncome - summary.totalExpense,
      period: {
        from: startDate,
        to: endDate
      }
    };
  }
}