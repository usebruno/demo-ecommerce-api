import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());
  
  // Add global prefix for all routes except opencollection
  app.setGlobalPrefix('api', {
    exclude: ['opencollection']
  });
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('The E-Commerce API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
