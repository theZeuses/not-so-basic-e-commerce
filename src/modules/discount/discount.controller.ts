import { DiscountService } from "@modules/discount/discount.service";
import { Request } from 'express';
import { Response } from 'express';
import { formatError, formatSuccess } from '@common/helpers/responseFormatter';
import { makeSelectCondition } from "@common/helpers/QueryParser";

export class DiscountController {
    constructor(private readonly discountService: DiscountService){
        this.discountService = discountService;
    }
    
    async getAll(req: Request, res: Response){
        try{
            const discounts = await this.discountService.findAll(makeSelectCondition(req.query, []));
            return res.json(discounts);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async getOne(req: Request, res: Response){
        try{
            const discount = await this.discountService.findOneById(req.params.id);
            return res.json(discount);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async createOne(req: Request, res: Response){
        try{
            const discount = await this.discountService.createOne(req.body);
            return formatSuccess(res, discount, 201);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async patchOne(req: Request, res: Response){
        try{
            const discount = await this.discountService.patchOneById(req.params.id, req.body);
            return formatSuccess(res, discount);
        }catch(err: any){
            return formatError(res, err);
        }
    }
}