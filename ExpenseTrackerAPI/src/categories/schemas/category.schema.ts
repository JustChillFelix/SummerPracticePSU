import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: true, unique: true, minlength: 2, maxlength: 50 })
    name: string;

    @Prop({
        required: true,
        match: /^#[0-9A-Fa-f]{6}$/
    })
    color: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);