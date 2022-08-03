import { Router } from 'express';
import { OrderItemController } from '@modules/orderItem/orderItem.controller';
import { OrderItemRouter } from '@modules/orderItem/orderItem.router';
import { OrderItemService } from '@modules/orderItem/orderItem.service';
import { OrderItemModel } from '@modules/orderItem/model/orderItem.model';

export class OrderItemModule {
    public readonly orderItemService: OrderItemService;
    public readonly router: Router;

    constructor(
        private readonly orderItemModel: typeof OrderItemModel
    ){
        this.orderItemService = new OrderItemService(this.orderItemModel);
        const orderItemController = new OrderItemController(this.orderItemService);
        const orderItemRouter = new OrderItemRouter(orderItemController, Router());

        this.router = Router();
        this.router.use('/api/v1/order-items', orderItemRouter.v1ApiRoute());
    }
}