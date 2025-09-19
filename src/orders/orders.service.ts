import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cartService: CartService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    // Get the user's cart
    const cartItems = await this.cartService.getCart(userId);
    
    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestException('Cannot create order with empty cart');
    }
    
    // Create a new order
    const order = this.orderRepository.create({
      userId: userId,
      shippingAddress: createOrderDto.shippingAddress,
      total: 0, // Will calculate below
    });
    
    // Save the order to get an ID
    const savedOrder = await this.orderRepository.save(order);
    
    // Create order items from cart items
    let total = 0;
    // Explicitly type the orderItems array to fix the TypeScript error
    const orderItems: OrderItem[] = [];
    
    for (const cartItem of cartItems) {
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: cartItem.product.price,
      });
      
      // Save the order item and add it to the array
      const savedOrderItem = await this.orderItemRepository.save(orderItem);
      orderItems.push(savedOrderItem);
      
      // Update the total
      total += cartItem.product.price * cartItem.quantity;
    }
    
    // Update order with total
    savedOrder.total = total;
    await this.orderRepository.save(savedOrder);
    
    // Clear the cart
    await this.cartService.clearCart(userId);
    
    // Return the order with items
    return {
      ...savedOrder,
      items: orderItems,
    };
  }

  async getUserOrders(userId: string) {
    // Find all orders for the user
    const orders = await this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    
    // For each order, get the order items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await this.orderItemRepository.find({
          where: { orderId: order.id },
          relations: ['product'],
        });
        
        // Return order without userId and with items
        const { userId, ...orderWithoutUserId } = order;
        
        return {
          ...orderWithoutUserId,
          items: orderItems,
        };
      })
    );
    
    return ordersWithItems;
  }

  async getOrderById(id: string) {
    // Get order
    const order = await this.orderRepository.findOne({
      where: { id }
    });
    
    if (!order) {
      throw new NotFoundException(`Order not found`);
    }
    
    // Get order items
    const orderItems = await this.orderItemRepository.find({
      where: { orderId: id },
      relations: ['product'],
    });
    
    return {
      ...order,
      items: orderItems,
    };
  }
} 