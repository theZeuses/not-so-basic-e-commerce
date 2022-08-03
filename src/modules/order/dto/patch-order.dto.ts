import { IsNumber, IsOptional } from 'class-validator';

export class PatchOrderDto {
    @IsOptional()
    user_id: number;

    @IsOptional()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsNumber()
    after_discount_amount: number;
}