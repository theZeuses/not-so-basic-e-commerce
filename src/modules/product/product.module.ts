import { Router } from 'express';
import { ProductController } from '@modules/product/product.controller';
import { ProductRouter } from '@modules/product/product.router';
import { ProductService } from '@modules/product/product.service';
import { ProductModel } from '@modules/product/model/product.model';

export class ProductModule {
    public readonly productService: ProductService;
    public readonly router: Router;

    constructor(
        private readonly productModel: typeof ProductModel
    ){
        this.productService = new ProductService(this.productModel);
        const productController = new ProductController(this.productService);
        const productRouter = new ProductRouter(productController, Router());

        this.router = Router();
        this.router.use('/api/v1/products', productRouter.v1ApiRoute());
    }
}