import { ProductController } from '@modules/product/product.controller';
import { Router } from 'express';
import * as BearerTokenMiddleware from '@common/middleware/BearerTokenMiddleware';
import * as AuthorizationMiddleware from '@common/middleware/AuthorizationMiddleware';
import { Role } from '@common/enums';

export class ProductRouter {
    constructor(
        private readonly productController: ProductController, 
        private readonly router: Router
    ){}
    
    v1ApiRoute(){
        //get all products (with filters, search, relationships, relationshipFilter, pagination)
        this.router.get('/', this.productController.getAll.bind(this.productController));

        //insert a new product 
        this.router.post(
            '/', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ADMIN),
            this.productController.createOne.bind(this.productController)
        );

        //get a product by id
        this.router.get('/:id', this.productController.getOne.bind(this.productController));
        
        //patch a product by id
        this.router.patch(
            '/:id', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ADMIN),
            this.productController.patchOne.bind(this.productController)
        );

        //publish a product
        this.router.post(
            '/:id/publish', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ADMIN),
            this.productController.publishOne.bind(this.productController)
        );

        //unpublish a product
        this.router.post(
            '/:id/unpublish', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ADMIN),
            this.productController.unpublishOne.bind(this.productController)
        );

        return this.router;
    }
}