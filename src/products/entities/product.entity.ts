import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  image: string;

  @Column()
  category: string;

  @Column({ default: true })
  available: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
} 