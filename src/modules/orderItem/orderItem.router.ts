import { OrderItemController } from '@modules/orderItem/orderItem.controller';
import { Router } from 'express';
import * as BearerTokenMiddleware from '@common/middleware/BearerTokenMiddleware';
import * as AuthorizationMiddleware from '@common/middleware/AuthorizationMiddleware';
import { Role } from '@common/enums';

export class OrderItemRouter {
    constructor(
        private readonly orderItemController: OrderItemController, 
        private readonly router: Router
    ){}
    
    v1ApiRoute(){
        //get all order items (with filters, search, relationships, relationshipFilter, pagination)
        this.router.get(
            '/', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.CUSTOMER, Role.ADMIN),
            this.orderItemController.getAll.bind(this.orderItemController)
        );

        //insert a order item for a order
        this.router.post(
            '/', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.CUSTOMER),
            this.orderItemController.createOne.bind(this.orderItemController)
        );

        //get an order item by id
        this.router.get(
            '/:id', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.CUSTOMER, Role.ADMIN),
            this.orderItemController.getOne.bind(this.orderItemController)
        );

        //update an order item by id
        this.router.patch(
            '/:id', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.CUSTOMER),
            this.orderItemController.patchOne.bind(this.orderItemController)
        );
        
        return this.router;
    }
}