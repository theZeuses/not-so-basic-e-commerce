import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class OrderItemDto {
    @IsOptional()
    id?: number;

    @IsNotEmpty()
    order_id: number;

    @IsNotEmpty()
    product_id: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    per_price: number;

    @IsNotEmpty()
    @IsNumber()
    after_discount_per_price: number;

    @IsOptional()
    created_at?: Date

    @IsOptional()
    updated_at?: Date
}