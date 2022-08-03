import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrUpdateCartItemDto {
    @IsOptional()
    cart_id?: number;

    @IsOptional()
    user_id?: number;

    @IsNotEmpty()
    product_id: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}