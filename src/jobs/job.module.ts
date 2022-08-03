import { AbandonedCartCheckerQueue, AbandonedCartNotifierQueue, OrderConfirmedEmailQueue } from '@providers/queue/queue.provider';
import { AbandonedCartCheckerConsumer, AbandonedCartNotifierConsumer, OrderConfirmationEmailConsumer } from './consumers';
import { CartService } from '@modules/cart/cart.service';

export class JobModule {
    constructor(
        private readonly cartService: CartService
    ){        
        //register consumers
        new OrderConfirmationEmailConsumer(OrderConfirmedEmailQueue);
        new AbandonedCartCheckerConsumer(
            AbandonedCartCheckerQueue,
            this.cartService
        );
        new AbandonedCartNotifierConsumer(AbandonedCartNotifierQueue);
    }
}