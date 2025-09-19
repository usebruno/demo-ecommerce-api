import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async getCart(userId: string) {
    const cartItems = await this.cartItemRepository.find({
      where: { userId },
      relations: ['product'],
    });
    
    return cartItems;
  }

  async addToCart(addToCartDto: AddToCartDto, userId: string) {
    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: addToCartDto.productId }
    });
    
    if (!product) {
      throw new NotFoundException(`Product not found`);
    }
    
    // Check if item already exists in cart
    const existingItem = await this.cartItemRepository.findOne({
      where: {
        userId: userId,
        productId: addToCartDto.productId,
      }
    });
    
    if (existingItem) {
      // Update quantity if item already exists
      const newQuantity = existingItem.quantity + addToCartDto.quantity;
      
      existingItem.quantity = newQuantity;
      return this.cartItemRepository.save(existingItem);
    } else {
      // Add new item to cart
      const cartItem = this.cartItemRepository.create({
        userId: userId,
        productId: addToCartDto.productId,
        quantity: addToCartDto.quantity,
      });
      
      return this.cartItemRepository.save(cartItem);
    }
  }

  async updateCartItem(itemId: string, updateCartItemDto: UpdateCartItemDto) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId }
    });
    
    if (!cartItem) {
      throw new NotFoundException(`Cart item not found`);
    }
    
    cartItem.quantity = updateCartItemDto.quantity;
    
    return this.cartItemRepository.save(cartItem);
  }

  async removeFromCart(itemId: string) {
    const result = await this.cartItemRepository.delete(itemId);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Cart item not found`);
    }
    
    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: string) {
    await this.cartItemRepository.delete({ userId });
    
    return { message: 'Cart cleared successfully' };
  }

  async updateCartItemByProductId(productId: string, userId: string, updateCartItemDto: UpdateCartItemDto) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { 
        userId: userId,
        productId: productId 
      }
    });
    
    if (!cartItem) {
      throw new NotFoundException(`Cart item not found`);
    }
    
    cartItem.quantity = updateCartItemDto.quantity;
    
    return this.cartItemRepository.save(cartItem);
  }

  async removeFromCartByProductId(productId: string, userId: string) {
    const result = await this.cartItemRepository.delete({
      userId: userId,
      productId: productId
    });
    
    if (result.affected === 0) {
      throw new NotFoundException(`Cart item not found`);
    }
    
    return { message: 'Item removed from cart' };
  }
} 