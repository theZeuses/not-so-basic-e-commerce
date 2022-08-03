import { IsNotEmpty } from 'class-validator';

export class CreateDiscountDto {
    @IsNotEmpty()
    product_id: number;

    @IsNotEmpty()
    percentage: number;
}