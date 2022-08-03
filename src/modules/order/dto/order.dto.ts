import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { OrderStatus } from '@common/enums';

export class OrderDto {
    @IsOptional()
    id?: number;

    @IsNotEmpty()
    user_id: number;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsNumber()
    after_discount_amount: number;

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: string;

    @IsOptional()
    created_at?: Date

    @IsOptional()
    updated_at?: Date
}