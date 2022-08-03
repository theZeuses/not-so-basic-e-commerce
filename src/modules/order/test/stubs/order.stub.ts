import { OrderDto } from '@modules/order/dto';

export const orderStub = () : OrderDto => {
    return {
        id: 1,
        user_id: 1,
        amount: 100,
        after_discount_amount: 95,
        status: "CREATED"
    }
}