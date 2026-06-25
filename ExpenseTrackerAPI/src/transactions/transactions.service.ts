import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsQueryDto } from './dto/get-transactions-query.dto';
import { CategoriesService } from '../categories/categories.service';
import { UpdateTransactionDto } from './dto/update-transactions.dto';
import { TagsService } from '../tags/tags.service'; 

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    private categoriesService: CategoriesService,
    private tagsService: TagsService,
  ) {}

  private async validateTags(tagIds: string[]) {
    if (!tagIds || tagIds.length === 0) return;

    for (const tagId of tagIds) {
      await this.tagsService.findOne(tagId); 
    }
  }

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    await this.categoriesService.findOne(createTransactionDto.category);
    
    await this.validateTags(createTransactionDto.tags);

    const createdTransaction = new this.transactionModel(createTransactionDto);
    return await createdTransaction.save();
  }

  async findAll(query: GetTransactionsQueryDto) {
    const { page = 1, limit = 20, search, type, categoryId, dateFrom, dateTo, tags, sortBy = 'date', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (type) filter.type = type;
    if (categoryId) filter.category = new Types.ObjectId(categoryId);
    
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }
    
    if (search) filter.description = { $regex: search, $options: 'i' };

    if (tags && tags.length > 0) {
      const tagObjectIds = tags.map(tagId => new Types.ObjectId(tagId));
      filter.tags = { $in: tagObjectIds };
      
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
      this.transactionModel.find(filter).populate('category').populate('tags').sort(sortOptions).skip(skip).limit(limit).exec(),
      this.transactionModel.countDocuments(filter),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findById(id)
      .populate('category')
      .populate('tags') 
      .exec();
    
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async update(id: string, updateDto: UpdateTransactionDto) {
    if (updateDto.category) {
      const categoryExists = await this.categoriesService.findOne(updateDto.category);
      if (!categoryExists) {
        throw new NotFoundException(`Category with ID ${updateDto.category} not found`);
      }
    }

      if (updateDto.tags) {
      await this.validateTags(updateDto.tags);
    }

    const updatedTransaction = await this.transactionModel
      .findByIdAndUpdate(id, updateDto, { new: true, runValidators: true })
      .exec();

    if (!updatedTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return updatedTransaction;
  }

  async remove(id: string): Promise<void> {
    const result = await this.transactionModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Transaction with ID ${id} not found`);
  }
}