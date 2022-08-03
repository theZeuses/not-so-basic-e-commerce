import { CartDto } from '@modules/cart/dto';

export const cartStub = () : CartDto => {
    return {
        id: 1,
        user_id: 1,
        followedUp: false
    }
}