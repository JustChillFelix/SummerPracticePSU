import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TagDocument = Tag & Document;

@Schema({ timestamps: true })
export class Tag {
  @ApiProperty({ example: 'Срочные покупки', description: 'Уникальное название тега' })
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  name: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);