import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SimpleAuthGuard } from './guards/simple-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(SimpleAuthGuard)
  logout(@Req() req) {
    return this.authService.logout(req.user.id);
  }

  @Get('whoami')
  @UseGuards(SimpleAuthGuard)
  async getProfile(@Req() req) {
    // Get the complete user data from the service using the ID from the request
    const user = await this.authService.findUserById(req.user.id);
    
    // Return user information
    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }
} 