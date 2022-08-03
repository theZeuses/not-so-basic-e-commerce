import { Router } from 'express';
import { OrderController } from '@modules/order/order.controller';
import { OrderRouter } from '@modules/order/order.router';
import { OrderService } from '@modules/order/order.service';
import { OrderModel } from '@modules/order/model/order.model';

export class OrderModule {
    public readonly orderService: OrderService;
    public readonly router: Router;

    constructor(
        private readonly orderModel: typeof OrderModel
    ){
        this.orderService = new OrderService(
            this.orderModel
        );
        const orderController = new OrderController(this.orderService);
        const orderRouter = new OrderRouter(orderController, Router());

        this.router = Router();
        this.router.use('/api/v1/orders', orderRouter.v1ApiRoute());
    }
}