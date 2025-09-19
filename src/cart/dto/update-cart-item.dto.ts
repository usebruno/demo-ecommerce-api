import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
} 