import { Equals, IsNotEmpty, IsNumber } from 'class-validator';
import { OrderStatus } from '@common/enums';

export class CreateOrderDto {
    @IsNotEmpty()
    user_id: number;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsNumber()
    after_discount_amount: number;

    @Equals(OrderStatus.CREATED)
    status: string;
}