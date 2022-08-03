import { CategoryService } from "@modules/category/category.service";
import { Request } from 'express';
import { Response } from 'express';
import { formatError, formatSuccess } from '@common/helpers/responseFormatter';
import { makeSelectCondition } from "@common/helpers/QueryParser";

export class CategoryController {
    constructor(private readonly categoryService: CategoryService){
        this.categoryService = categoryService;
    }
    
    async getAll(req: Request, res: Response){
        try{
            const categories = await this.categoryService.findAll(makeSelectCondition(req.query, [
                'name'
            ]));
            return res.json(categories);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async getOne(req: Request, res: Response){
        try{
            const category = await this.categoryService.findOneById(req.params.id);
            return res.json(category);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async createOne(req: Request, res: Response){
        try{
            const category = await this.categoryService.createOne(req.body);
            return formatSuccess(res, category, 201);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async patchOne(req: Request, res: Response){
        try{
            const category = await this.categoryService.patchOneById(req.params.id, req.body);
            return formatSuccess(res, category);
        }catch(err: any){
            return formatError(res, err);
        }
    }
}