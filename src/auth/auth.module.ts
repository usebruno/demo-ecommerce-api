import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { SimpleAuthGuard } from './guards/simple-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, SimpleAuthGuard],
  exports: [AuthService, SimpleAuthGuard, TypeOrmModule.forFeature([User])],
})
export class AuthModule {} 