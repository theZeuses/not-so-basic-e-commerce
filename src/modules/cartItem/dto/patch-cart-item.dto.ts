import { IsNumber, IsOptional } from 'class-validator';

export class PatchCartItemDto {
    @IsOptional()
    cart_id: number;

    @IsOptional()
    product_id: number;

    @IsOptional()
    @IsNumber()
    quantity: number;
}