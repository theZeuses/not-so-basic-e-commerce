import { CategoryController } from '@modules/category/category.controller';
import { Router } from 'express';
import * as BearerTokenMiddleware from '@common/middleware/BearerTokenMiddleware';
import * as AuthorizationMiddleware from '@common/middleware/AuthorizationMiddleware';
import { Role } from '@common/enums';

export class CategoryRouter {
    constructor(
        private readonly categoryController: CategoryController, 
        private readonly router: Router
    ){}
    
    v1ApiRoute(){
        //get all categories (with filters, search, relationships, relationshipFilter, pagination)
        this.router.get('/', this.categoryController.getAll.bind(this.categoryController));

        //insert a new category
        this.router.post(
            '/', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ADMIN),
            this.categoryController.createOne.bind(this.categoryController)
        );

        //get a category by id
        this.router.get('/:id', this.categoryController.getOne.bind(this.categoryController));

        //patch a category by id
        this.router.patch(
            '/:id', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ADMIN),
            this.categoryController.patchOne.bind(this.categoryController)
        );
        return this.router;
    }
}