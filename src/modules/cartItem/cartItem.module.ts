import { Router } from 'express';
import { CartItemController } from '@modules/cartItem/cartItem.controller';
import { CartItemRouter } from '@modules/cartItem/cartItem.router';
import { CartItemService } from '@modules/cartItem/cartItem.service';
import { CartService } from '@modules/cart/cart.service';
import { ProductService } from '@modules/product/product.service';
import { CartItemModel } from '@modules/cartItem/model/cartItem.model';

export class CartItemModule {
    public readonly cartItemService: CartItemService;
    public readonly router: Router;

    constructor(
        private readonly cartItemModel: typeof CartItemModel,
        private readonly cartService: CartService,
        private readonly productsService: ProductService
    ){
        this.cartItemService = new CartItemService(this.cartItemModel, this.cartService, this.productsService);
        const cartItemController = new CartItemController(this.cartItemService);
        const cartItemRouter = new CartItemRouter(cartItemController, Router());

        this.router = Router();
        this.router.use('/api/v1/cart-items', cartItemRouter.v1ApiRoute());
    }
}