import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transactions, TransactionDocument, TransactionType } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transactions.name) private transactionModel: Model<TransactionDocument>,
    private categoriesService: CategoriesService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transactions> {
    await this.categoriesService.findOne(createTransactionDto.category);

    const createdTransaction = new this.transactionModel({
      ...createTransactionDto,
      date: new Date(createTransactionDto.date),
    });
    return await createdTransaction.save();
  }

  async findAll(queryParams: any) {
    const { page = 1, limit = 20, search, type, categoryId, dateFrom, dateTo, sortBy = 'date', sortOrder = 'desc' } = queryParams;
    
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (type) filter.type = type;

    if (categoryId) filter.category = new Types.ObjectId(categoryId);

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    if (search) {
      filter.description = { $regex: search, $options: 'i' };
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.transactionModel.find(filter)
        .populate('category')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.transactionModel.countDocuments(filter),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async remove(id: string): Promise<void> {
    const result = await this.transactionModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Transaction with ID ${id} not found`);
  }
}