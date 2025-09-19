import { Module } from '@nestjs/common';
import { ProductsModule } from '../../products/products.module';
import { ProductSeeder } from './product.seeder';

@Module({
  imports: [ProductsModule],
  providers: [ProductSeeder],
})
export class SeedersModule {} 