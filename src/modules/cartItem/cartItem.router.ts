import { CartItemController } from '@modules/cartItem/cartItem.controller';
import { Router } from 'express';
import * as BearerTokenMiddleware from '@common/middleware/BearerTokenMiddleware';
import * as CookieMiddleware from '@common/middleware/CookieMiddleware';
import { Role } from '@common/enums';

export class CartItemRouter {
    constructor(
        private readonly cartItemController: CartItemController, 
        private readonly router: Router
    ){}
    
    v1ApiRoute(){
        //get all cart items (with filters, search, relationships, relationshipFilter, pagination)
        this.router.get(
            '/', this.cartItemController.getAll.bind(this.cartItemController)
        );

        //insert a cart item or increase quantity of already inserted one  
        this.router.post(
            '/', 
            BearerTokenMiddleware.authenticateIfPropertyAndMatch('user_id'),
            CookieMiddleware.parseSingedCookie('x-app-cart'),
            this.cartItemController.createOne.bind(this.cartItemController)
        );

        //get a cart item by id
        this.router.get(
            '/:id', 
            this.cartItemController.getOne.bind(this.cartItemController)
        );

        //patch a cart item by id
        this.router.patch(
            '/:id', 
            BearerTokenMiddleware.authenticateIfPropertyAndMatch('user_id'),
            this.cartItemController.patchOne.bind(this.cartItemController)
        );
        
        //delete a cart item by id
        this.router.delete(
            '/:id', 
            this.cartItemController.deleteOne.bind(this.cartItemController)
        );

        return this.router;
    }
}