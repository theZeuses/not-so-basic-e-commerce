import { IsNumber, IsOptional } from 'class-validator';

export class PatchOrderItemDto {
    @IsOptional()
    order_id: number;

    @IsOptional()
    product_id: number;

    @IsOptional()
    @IsNumber()
    quantity: number;

    @IsOptional()
    @IsNumber()
    per_price: number;

    @IsOptional()
    @IsNumber()
    after_discount_per_price: number;
}