import { DiscountController } from '@modules/discount/discount.controller';
import { Router } from 'express';
import * as BearerTokenMiddleware from '@common/middleware/BearerTokenMiddleware';
import * as AuthorizationMiddleware from '@common/middleware/AuthorizationMiddleware';
import { Role } from '@common/enums';

export class DiscountRouter {
    constructor(
        private readonly discountController: DiscountController, 
        private readonly router: Router
    ){}
    
    v1ApiRoute(){
        //get all discounts (with filters, search, relationships, relationshipFilter, pagination)
        this.router.get(
            '/', this.discountController.getAll.bind(this.discountController)
        );

        //insert a discount for a product
        this.router.post(
            '/', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ADMIN),
            this.discountController.createOne.bind(this.discountController)
        );

        //get a discount by id
        this.router.get(
            '/:id', 
            this.discountController.getOne.bind(this.discountController)
        );

        //patch a discount
        this.router.patch(
            '/:id', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ADMIN),
            this.discountController.patchOne.bind(this.discountController)
        );
        
        return this.router;
    }
}