import { OrderItemDto } from '@modules/orderItem/dto';

export const orderItemStub = () : OrderItemDto => {
    return {
        id: 1,
        order_id: 1,
        product_id: 1,
        quantity: 1,
        per_price: 100,
        after_discount_per_price: 95
    }
}