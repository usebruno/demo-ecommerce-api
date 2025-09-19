import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req, Put, Logger } from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { SimpleAuthGuard } from '../auth/guards/simple-auth.guard';

@Controller('cart')
@UseGuards(SimpleAuthGuard)
export class CartController {
  private readonly logger = new Logger(CartController.name);
  
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('add/item/:productId')
  addToCart(
    @Param('productId') productId: string,
    @Body() body: { quantity?: number },
    @Req() req
  ) {
    // Log the user ID for debugging
    this.logger.debug(`Adding to cart for user: ${req.user.id}`);
    
    // Use the quantity from the body if provided, otherwise default to 1
    const quantity = body.quantity || 1;
    
    // Pass the user ID and product ID to the service
    return this.cartService.addToCart({ productId, quantity }, req.user.id);
  }

  @Put('item/:productId')
  updateCartItem(
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Req() req
  ) {
    return this.cartService.updateCartItemByProductId(productId, req.user.id, updateCartItemDto);
  }

  @Delete('item/:productId')
  removeFromCart(
    @Param('productId') productId: string,
    @Req() req
  ) {
    return this.cartService.removeFromCartByProductId(productId, req.user.id);
  }

  @Delete()
  clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
} 