import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesQueryDto } from './dto/get-categories-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const existingCategory = await this.categoryModel.findById(id).exec();
        if (!existingCategory) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        if (updateCategoryDto.name && updateCategoryDto.name !== existingCategory.name) {
            const duplicate = await this.categoryModel.findOne({ name: updateCategoryDto.name }).exec();
            if (duplicate) {
                throw new ConflictException('Category with this name already exists');
            }
        }

        const updatedCategory = await this.categoryModel.findByIdAndUpdate(
            id,
            updateCategoryDto,
            { new: true, runValidators: true }
        ).exec();

        return updatedCategory!; 
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

    async findAll(query: GetCategoriesQueryDto) {
        const { 
            page = 1, 
            limit = 20, 
            search, 
            sortBy = 'name', 
            sortOrder = 'asc' 
        } = query;

        const skip = (page - 1) * limit;
        const sortOptions: any = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const filter: any = {};
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const [data, total] = await Promise.all([
            this.categoryModel.find(filter).sort(sortOptions).skip(skip).limit(limit).exec(),
            this.categoryModel.countDocuments(filter),
        ]);

        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
}