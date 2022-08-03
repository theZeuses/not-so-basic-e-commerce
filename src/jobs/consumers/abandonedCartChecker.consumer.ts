import { Queue } from 'bull';
import { Job } from "@common/enums";
import { Consumer } from "@core/queue/Consumer";
import { CartService } from '@modules/cart/cart.service';
import { CartAbandonedNotification } from '@notifications/cartAbandoned/cartAbandoned.notification';

export class AbandonedCartCheckerConsumer extends Consumer<any> {
    constructor(
        queue: Queue, 
        private readonly cartService: CartService
    ){
        super(queue, Job.ABANDONED_CART_CHECKER);
    }
    
    protected async consumer(data: any) {
        const carts = await this.cartService.getNotFollowedUpCarts(4);

        const updatedCartPromises = carts.map(async (cart) => {
            const notification = new CartAbandonedNotification();
            await notification.mail({
                receiver: {
                    email: cart.User.email
                },
                payload: {
                    discounted_product_count: cart.discounted_product_count,
                    name: cart.User.name
                }
            });
            return cart.id;
        });
        const updatedCarts = await Promise.all(updatedCartPromises);
        return await this.cartService.markCartsAsFollowedUp(updatedCarts);
    }
}