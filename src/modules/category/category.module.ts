import { Router } from 'express';
import { CategoryController } from '@modules/category/category.controller';
import { CategoryRouter } from '@modules/category/category.router';
import { CategoryService } from '@modules/category/category.service';
import { CategoryModel } from '@modules/category/model/category.model';

export class CategoryModule {
    public readonly categoryService: CategoryService;
    public readonly router: Router;

    constructor(
        private readonly categoryModel: typeof CategoryModel
    ){
        this.categoryService = new CategoryService(this.categoryModel);
        const categoryController = new CategoryController(this.categoryService);
        const categoryRouter = new CategoryRouter(categoryController, Router());

        this.router = Router();
        this.router.use('/api/v1/categories', categoryRouter.v1ApiRoute());
    }
}