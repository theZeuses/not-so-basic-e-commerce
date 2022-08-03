import { IsNotEmpty, IsOptional } from 'class-validator';

export class DiscountDto {
    @IsOptional()
    id?: number;

    @IsNotEmpty()
    product_id: number;

    @IsNotEmpty()
    percentage: number;

    @IsOptional()
    created_at?: Date

    @IsOptional()
    updated_at?: Date
}