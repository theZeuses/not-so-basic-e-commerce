import { CartController } from '@modules/cart/cart.controller';
import { Router } from 'express';
import * as BearerTokenMiddleware from '@common/middleware/BearerTokenMiddleware';
import * as AuthorizationMiddleware from '@common/middleware/AuthorizationMiddleware';
import * as CookieMiddleware from '@common/middleware/CookieMiddleware';
import { Role } from '@common/enums';

export class CartRouter {
    constructor(
        private readonly cartController: CartController, 
        private readonly router: Router
    ){}
    
    v1ApiRoute(){
        //get all carts (with filters, search, relationships, relationshipFilter, pagination)
        this.router.get(
            '/', this.cartController.getAll.bind(this.cartController)
        );

        //insert a cart
        this.router.post(
            '/', 
            this.cartController.createOne.bind(this.cartController)
        );

        //get a cart by id
        this.router.get(
            '/:id', 
            this.cartController.getOne.bind(this.cartController)
        );

        //patch a cart by id
        this.router.patch(
            '/:id', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ADMIN),
            this.cartController.patchOne.bind(this.cartController)
        );

        //sync a cart from cookie with user
        this.router.post(
            '/sync',
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.CUSTOMER),
            CookieMiddleware.parseSingedCookie('x-app-cart'),
            this.cartController.syncWithUser.bind(this.cartController)
        );

        //place cart to the order queue
        this.router.post(
            '/:id/order',
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.CUSTOMER),
            this.cartController.placeOrder.bind(this.cartController)
        );
        
        return this.router;
    }
}