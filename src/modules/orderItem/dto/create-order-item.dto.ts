import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
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
}