import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CartItemDto {
    @IsOptional()
    id?: number;

    @IsNotEmpty()
    cart_id: number;

    @IsNotEmpty()
    product_id: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsOptional()
    created_at?: Date

    @IsOptional()
    updated_at?: Date
}