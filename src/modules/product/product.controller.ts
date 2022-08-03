import { ProductService } from "@modules/product/product.service";
import { Request } from 'express';
import { Response } from 'express';
import { formatError, formatSuccess } from '@common/helpers/responseFormatter';
import { makeSelectCondition } from "@common/helpers/QueryParser";

export class ProductController {
    constructor(private readonly productService: ProductService){
        this.productService = productService;
    }
    
    async getAll(req: Request, res: Response){
        try{
            const products = await this.productService.findAll(makeSelectCondition(req.query, [
                'name'
            ]));
            return res.json(products);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async getOne(req: Request, res: Response){
        try{
            const product = await this.productService.findOneById(req.params.id);
            return res.json(product);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async createOne(req: Request, res: Response){
        try{
            const product = await this.productService.createOne(req.body);
            return formatSuccess(res, product, 201);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async patchOne(req: Request, res: Response){
        try{
            const product = await this.productService.patchOneById(req.params.id, req.body);
            return formatSuccess(res, product);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async publishOne(req: Request, res: Response){
        try{
            const product = await this.productService.publishOneById(req.params.id);
            return formatSuccess(res, product);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async unpublishOne(req: Request, res: Response){
        try{
            const product = await this.productService.unpublishOneById(req.params.id);
            return formatSuccess(res, product);
        }catch(err: any){
            return formatError(res, err);
        }
    }
}