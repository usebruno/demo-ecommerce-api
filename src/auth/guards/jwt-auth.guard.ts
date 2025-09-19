import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    try {
      // For our simple implementation, we're just decoding the base64 token
      // In a real app, you'd use JWT with proper verification
      const decoded = Buffer.from(token, 'base64').toString().split(':');
      const userId = decoded[0];
      
      // Verify the user exists
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      // Add user to request object
      request.user = {
        id: user.id,
        email: user.email,
      };
      
      return true;
    } catch (err) {
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