import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private databaseService: DatabaseService) {}

  async findAll(category?: string) {
    const repository = this.databaseService.getRepository<Product>(Product);
    
    if (category) {
      return repository.find({ where: { category } });
    }
    
    return repository.find();
  }

  async findOne(id: string) {
    const repository = this.databaseService.getRepository<Product>(Product);
    
    const product = await repository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const repository = this.databaseService.getRepository<Product>(Product);
    
    const product = repository.create({
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      category: createProductDto.category,
      image: createProductDto.image_url,
      available: true,
    });
    
    return repository.save(product);
  }

  async createMany(products: CreateProductDto[]): Promise<Product[]> {
    const results: Product[] = [];
    
    for (const productDto of products) {
      const product = await this.create(productDto);
      results.push(product);
    }
    
    return results;
  }
} 