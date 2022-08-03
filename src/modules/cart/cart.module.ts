import { Router } from 'express';
import { CartController } from '@modules/cart/cart.controller';
import { CartRouter } from '@modules/cart/cart.router';
import { CartService } from '@modules/cart/cart.service';
import { CartItemModel } from '@modules/cartItem/model/cartItem.model';
import { OrderModel } from '@modules/order/model/order.model';
import { OrderItemModel } from '@modules/orderItem/model/orderItem.model';
import { ProductModel } from '@modules/product/model/product.model';
import { CartModel } from './model/cart.model';

export class CartModule {
    public readonly cartService: CartService;
    public readonly router: Router;

    constructor(
        private readonly cartModel: typeof CartModel,
        private readonly cartItemModel: typeof CartItemModel,
        private readonly productModel: typeof ProductModel,
        private readonly orderModel: typeof OrderModel,
        private readonly orderItemModel: typeof OrderItemModel
    ){
        this.cartService = new CartService(
            this.cartModel, this.cartItemModel, this.productModel, this.orderModel, this.orderItemModel
        );
        const cartController = new CartController(this.cartService);
        const cartRouter = new CartRouter(cartController, Router());

        this.router = Router();
        this.router.use('/api/v1/carts', cartRouter.v1ApiRoute());
    }
}