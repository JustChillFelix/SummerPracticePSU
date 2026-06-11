"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_schema_1 = require("./schemas/category.schema");
let CategoriesService = class CategoriesService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    async create(createCategoryDto) {
        const existingCategory = await this.categoryModel.findOne({
            name: createCategoryDto.name
        });
        if (existingCategory) {
            throw new common_1.ConflictException('Category with this name already exists');
        }
        const createdCategory = new this.categoryModel(createCategoryDto);
        return await createdCategory.save();
    }
    async update(id, updateCategoryDto) {
        const existingCategory = await this.categoryModel.findById(id);
        if (existingCategory) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        if (updateCategoryDto.name && updateCategoryDto.name !== existingCategory.name) {
            const duplicate = await this.categoryModel.findOne({ name: updateCategoryDto.name });
            if (duplicate) {
                throw new common_1.ConflictException('Category with tihs name already exists');
            }
        }
        const updatedData = { ...existingCategory.toObject(), ...updateCategoryDto };
        return await this.categoryModel.findByIdAndUpdate(id, updatedData, { new: true });
    }
    async remove(id) {
        const result = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
    }
    async findOne(id) {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async findAll(page = 1, limit = 20, search, sortBy = 'name', sortOrder = 'asc') {
        const skip = (page - 1) * limit;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const query = {};
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
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map