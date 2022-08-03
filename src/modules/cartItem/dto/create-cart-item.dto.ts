import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCartItemDto {
    @IsNotEmpty()
    cart_id: number;

    @IsNotEmpty()
    product_id: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}