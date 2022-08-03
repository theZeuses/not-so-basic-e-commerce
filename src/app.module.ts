import { Router } from 'express';
import { UserModule } from '@modules/user/user.module';
import { CategoryModule } from '@modules/category/category.module';
import { ProductModule } from '@modules/product/product.module';
import { AuthModule } from '@modules/auth/auth.module';
import { JobModule } from '@jobs/job.module';
import { initializeNotifme } from '@common/helpers/notifmeHelper';
import { CartModule } from '@modules/cart/cart.module';
import { CartItemModule } from '@modules/cartItem/cartItem.module';
import { OrderModule } from '@modules/order/order.module';
import { OrderItemModule } from '@modules/orderItem/orderItem.module';
import { DiscountModule } from '@modules/discount/discount.module';
import { UserModel } from '@modules/user/model/user.model';
import { CategoryModel } from '@modules/category/model/category.model';
import { ProductModel } from '@modules/product/model/product.model';
import { DiscountModel } from '@modules/discount/model/discount.model';
import { CartModel } from '@modules/cart/model/cart.model';
import { CartItemModel } from '@modules/cartItem/model/cartItem.model';
import { OrderModel } from '@modules/order/model/order.model';
import { OrderItemModel } from '@modules/orderItem/model/orderItem.model';
import { abandonedCartCheckerProducer } from '@jobs/producers';

export class AppModule {
    private readonly jobModule: JobModule;

    //exports
    public readonly router: Router;
    public readonly userModule: UserModule;
    public readonly categoryModule: CategoryModule;
    public readonly productModule: ProductModule;
    public readonly discountModule: DiscountModule;
    public readonly authModule: AuthModule;
    public readonly cartModule: CartModule;
    public readonly cartItemModule: CartItemModule;
    public readonly orderModule: OrderModule;
    public readonly orderItemModule: OrderItemModule;

    constructor(){
        this.router = Router();

        //register modules
        this.userModule = new UserModule(UserModel);
        this.categoryModule = new CategoryModule(CategoryModel);
        this.productModule = new ProductModule(ProductModel);
        this.discountModule = new DiscountModule(DiscountModel);
        this.authModule = new AuthModule(this.userModule.userService, UserModel);
        this.cartModule = new CartModule(
            CartModel,
            CartItemModel,
            ProductModel,
            OrderModel,
            OrderItemModel
        );
        this.cartItemModule = new CartItemModule(
            CartItemModel, 
            this.cartModule.cartService,
            this.productModule.productService
        );
        this.jobModule = new JobModule(this.cartModule.cartService);
        this.orderModule = new OrderModule(
            OrderModel
        );
        this.orderItemModule = new OrderItemModule(OrderItemModel);

        //register the routers
        this.router.use(
            this.userModule.router,
            this.cartModule.router, 
            this.authModule.router, 
            this.cartItemModule.router,
            this.orderItemModule.router,
            this.orderModule.router,
            this.productModule.router,
            this.discountModule.router,
            this.categoryModule.router
        );

        this.bootstrap();
    } 
    
    bootstrap(){
        initializeNotifme();
        abandonedCartCheckerProducer.produce(undefined);
    }
}