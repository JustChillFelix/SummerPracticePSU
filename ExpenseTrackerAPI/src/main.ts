import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    logger.log('Starting application...');
    
    try {
        const app = await NestFactory.create(AppModule);
        logger.log('Nest application created');


        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true, 
            transform: true,
        }));


        const config = new DocumentBuilder()
            .setTitle('Expense Tracker API')
            .setDescription('API for personal income and expense tracking')
            .setVersion('1.0')
            .build();
        
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);
        logger.log('Swagger setup complete');


        const port = process.env.PORT || 3000;
        await app.listen(port);
        logger.log(`Application is running on: http://localhost:${port}`);
        
        if (process.env.NODE_ENV !== 'production') {
            logger.log(`Swagger documentation: http://localhost:${port}/api`);
        }
    } catch (error) {
        logger.error('Application failed to start:', error);
        process.exit(1);
    }
}

bootstrap();