import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class SimpleAuthGuard implements CanActivate {
  private readonly logger = new Logger(SimpleAuthGuard.name);
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    try {
      // Decode the token - now it should just be the base64 encoded user ID
      const userId = Buffer.from(token, 'base64').toString();
      
      this.logger.debug(`Decoded user ID from token: ${userId}`);
      
      // Verify the user exists in the database
      const user = await this.userRepository.findOne({ where: { id: userId } });
      
      if (!user) {
        this.logger.warn(`User with ID ${userId} not found in database`);
        throw new UnauthorizedException('User not found');
      }
      
      // Add user to request object
      request.user = {
        id: user.id,
      };
      
      return true;
    } catch (err) {
      this.logger.error(`Token decoding error: ${err.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }
    
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
} 