import { Module } from '@nestjs/commin';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';

@Module({
	imports: [
	MongooseModule.forRoot('mongodb://localhost:27017/expense_tracker'),
	CategoriesModule,
	],
})
export class AppModule {}