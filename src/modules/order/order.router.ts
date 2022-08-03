import { OrderController } from '@modules/order/order.controller';
import { Router } from 'express';
import * as BearerTokenMiddleware from '@common/middleware/BearerTokenMiddleware';
import * as AuthorizationMiddleware from '@common/middleware/AuthorizationMiddleware';
import { Role } from '@common/enums';

export class OrderRouter {
    constructor(
        private readonly orderController: OrderController, 
        private readonly router: Router
    ){}
    
    v1ApiRoute(){
        //get all orders (with filters, search, relationships, relationshipFilter, pagination)
        this.router.get(
            '/', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.CUSTOMER, Role.ADMIN),
            this.orderController.getAll.bind(this.orderController)
        );

        //get a order by id
        this.router.get(
            '/:id', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.CUSTOMER, Role.ADMIN),
            this.orderController.getOne.bind(this.orderController)
        );

        //patch a order by id
        this.router.patch(
            '/:id', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ADMIN),
            this.orderController.patchOne.bind(this.orderController)
        );

        //confirm a created order
        this.router.post(
            '/:id/confirm', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.CUSTOMER),
            this.orderController.confirmOne.bind(this.orderController)
        );

        //mark a confirmed order as delivered upon delivery
        this.router.post(
            '/:id/delivered', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ADMIN),
            this.orderController.markOneAsDelivered.bind(this.orderController)
        );
        
        return this.router;
    }
}