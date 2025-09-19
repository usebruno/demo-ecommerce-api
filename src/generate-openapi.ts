import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function generateOpenApiSpec() {
  const app = await NestFactory.create(AppModule, { logger: false });
  
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('The E-Commerce API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Write the OpenAPI spec to a file
  fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
  
  console.log('OpenAPI spec generated successfully at ./openapi.json');
  
  await app.close();
}

generateOpenApiSpec();