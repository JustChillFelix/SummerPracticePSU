import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    console.log('Starting application...');
    
    try {
        const app = await NestFactory.create(AppModule);
        console.log('Nest application created');

        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            transform: true,
        }));

        const config = new DocumentBuilder()
            .setTitle('Expense Tracker API')
            .setDescription('The Expense Tracker API description')
            .setVersion('1.0')
            .build();
        
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);
        console.log('Swagger setup complete');

        await app.listen(3000);
        console.log('Application is running on: http://localhost:3000');
    } catch (error) {
        console.error('Application failed to start:', error);
        throw error;
    }
}

bootstrap();