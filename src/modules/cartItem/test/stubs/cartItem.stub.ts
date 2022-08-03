import { CartItemDto } from '@modules/cartItem/dto';

export const cartItemStub = () : CartItemDto => {
    return {
        id: 1,
        cart_id: 1,
        product_id: 1,
        quantity: 1
    }
}