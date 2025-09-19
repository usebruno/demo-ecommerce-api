import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ProductsService } from '../../products/products.service';
import { CreateProductDto } from '../../products/dto/create-product.dto';

@Injectable()
export class ProductSeeder implements OnModuleInit {
  private readonly logger = new Logger(ProductSeeder.name);

  constructor(private readonly productsService: ProductsService) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    try {
      this.logger.log('Seeding products...');
      const existingProducts = await this.productsService.findAll();
      
      if (existingProducts.length > 0) {
        this.logger.log(`Found ${existingProducts.length} existing products. Skipping seeding.`);
        return;
      }
      
      const sampleProducts: CreateProductDto[] = [
        {
          name: 'Smartphone X',
          description: 'Latest smartphone with advanced features',
          price: 999.99,
          category: 'Electronics',
          image_url: 'https://example.com/images/smartphone-x.jpg',
        },
        {
          name: 'Running Shoes',
          description: 'Comfortable running shoes for professional athletes',
          price: 129.99,
          category: 'Sports',
          image_url: 'https://example.com/images/running-shoes.jpg',
        },
        {
          name: 'Coffee Maker',
          description: 'Automatic coffee maker with timer',
          price: 89.99,
          category: 'Home',
          image_url: 'https://example.com/images/coffee-maker.jpg',
        },
        {
          name: 'Laptop Pro',
          description: 'High-performance laptop for professionals',
          price: 1499.99,
          category: 'Electronics',
          image_url: 'https://example.com/images/laptop-pro.jpg',
        },
        {
          name: 'Wireless Earbuds',
          description: 'Premium wireless earbuds with noise cancellation',
          price: 199.99,
          category: 'Electronics',
          image_url: 'https://example.com/images/wireless-earbuds.jpg',
        },
      ];
      
      const seededProducts = await this.productsService.createMany(sampleProducts);
      this.logger.log(`Successfully seeded ${seededProducts.length} products`);
    } catch (error) {
      this.logger.error('Failed to seed products', error);
    }
  }
} 