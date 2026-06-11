import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<import("./schemas/category.schema").Category>;
    findAll(page?: number, limit?: number, search?: string, sortBy?: string, sortOrder?: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/category.schema").CategoryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/category.schema").Category & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findOne(id: string): Promise<import("./schemas/category.schema").Category>;
    remove(id: string): Promise<void>;
}
