import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
        @Query('search') search?: string,
        @Query('sortBy') sortBy = 'name',
        @Query('sortOrder') sortOrder = 'asc',
    ) {
        return this.categoriesService.findAll(page, limit, search, sortBy, sortOrder);
    }

    @Get(':id')
    findOne(@Param('id') id:string) {
        return this.categoriesService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
