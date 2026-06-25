import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from '../../categories/schemas/category.schema';

export type TransactionDocument = Transaction & Document;

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId | Category;

  @Prop({ 
    required: true, 
    min: 0.01,
    validate: {
      validator: function(v: number) {
        return /^\d+(\.\d{1,2})?$/.test(v.toString());
      },
      message: 'Amount must have max 2 decimal places'
    }
  })
  amount: number;

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ maxlength: 255, default: '' })
  description: string;

  @Prop({ 
    required: true,
    validate: {
      validator: function(v: Date) {
        return v <= new Date();
      },
      message: 'Date cannot be in the future'
    }
  })
  date: Date;

  @ApiPropertyOptional({ description: 'Массив ID тегов', type: [String] })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Tag' }], default: [] })
  tags: Types.ObjectId[]; 
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);