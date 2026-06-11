import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    ) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const existingCategory = await this.categoryModel.findOne({
            name: createCategoryDto.name
        });

        if (existingCategory) {
            throw new ConflictException('Category with this name already exists');
        }

        const createdCategory = new this.categoryModel(createCategoryDto);
        return await createdCategory.save();
    }

    async update (id: string, updateCategoryDto: CreateCategoryDto): Promise<Category> {
        const existingCategory = await this.categoryModel.findById(id);
        if (existingCategory) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        if (updateCategoryDto.name && updateCategoryDto.name !== existingCategory.name) {
            const duplicate = await this.categoryModel.findOne({ name: updateCategoryDto.name });
            if (duplicate) {
                throw new ConflictException('Category with tihs name already exists');
            }
        }

        const updatedData = {...existingCategory.toObject(), ...updateCategoryDto};

        return await this.categoryModel.findByIdAndUpdate(
            id,
            updatedData,
            { new: true }
        );
    }

    async remove(id: string): Promise<void> {

        const result = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }

    async findAll(page = 1, limit = 20, search?: string, sortBy = 'name', sortOrder = 'asc') {
        const skip = (page - 1) * limit;
        const sortOptions: any = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const query: any = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const [data, total] = await Promise.all([
        this.categoryModel.find(query).sort(sortOptions).skip(skip).limit(limit).exec(),
        this.categoryModel.countDocuments(query),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }
}