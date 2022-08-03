import { IsOptional } from 'class-validator';

export class PatchDiscountDto {
    @IsOptional()
    product_id: number;

    @IsOptional()
    percentage: number;
}