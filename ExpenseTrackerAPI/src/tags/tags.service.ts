import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';
import { CreateTagDto } from './dto/create-tag-dto';
import { UpdateTagDto } from './dto/update-tag-dto';
import { InjectModel as InjectTransactionModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from '../transactions/schemas/transaction.schema';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    @InjectTransactionModel(Transaction.name) private transactionModel: Model<TransactionDocument>, 
  ) {}


  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const existingTag = await this.tagModel.findOne({ name: createTagDto.name.toLowerCase() }).exec();
    if (existingTag) {
      throw new ConflictException(`Tag with name "${createTagDto.name}" already exists`);
    }

    const createdTag = new this.tagModel({
      ...createTagDto,
      name: createTagDto.name.toLowerCase(), 
    });
    return await createdTag.save();
  }

  async findAll() {
    return await this.tagModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {

    if (updateTagDto.name) {
      const existingTag = await this.tagModel.findOne({ 
        name: updateTagDto.name.toLowerCase(),
        _id: { $ne: id } 
      }).exec();
      
      if (existingTag) {
        throw new ConflictException(`Tag with name "${updateTagDto.name}" already exists`);
      }
      updateTagDto.name = updateTagDto.name.toLowerCase();
    }

    const updatedTag = await this.tagModel
      .findByIdAndUpdate(id, updateTagDto, { new: true, runValidators: true })
      .exec();

    if (!updatedTag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return updatedTag;
  }

  async remove(id: string): Promise<void> {
    const result = await this.tagModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
  }

    async getStatistics() {
    const stats = await this.transactionModel.aggregate([
      { $unwind: '$tags' },
      
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      
      { $sort: { count: -1 } },
      
      {
        $lookup: {
          from: 'tags',
          localField: '_id',
          foreignField: '_id',
          as: 'tagData',
        },
      },
            {
        $project: {
          _id: 1,
          count: 1,
          name: { $arrayElemAt: ['$tagData.name', 0] },
          createdAt: { $arrayElemAt: ['$tagData.createdAt', 0] },
          updatedAt: { $arrayElemAt: ['$tagData.updatedAt', 0] },
        },
      }
    ]).exec();

    return stats;
  }
}