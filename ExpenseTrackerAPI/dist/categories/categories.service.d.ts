import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesService {
    private categoryModel;
    constructor(categoryModel: Model<CategoryDocument>);
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    update(id: string, updateCategoryDto: CreateCategoryDto): Promise<Category>;
    remove(id: string): Promise<void>;
    findOne(id: string): Promise<Category>;
    findAll(page?: number, limit?: number, search?: string, sortBy?: string, sortOrder?: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, CategoryDocument, {}, import("mongoose").DefaultSchemaOptions> & Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
