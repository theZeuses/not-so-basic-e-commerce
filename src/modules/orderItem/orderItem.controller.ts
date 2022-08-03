import { OrderItemService } from "@modules/orderItem/orderItem.service";
import { Request } from 'express';
import { Response } from 'express';
import { formatError, formatSuccess } from '@common/helpers/responseFormatter';
import { makeSelectCondition } from "@common/helpers/QueryParser";

export class OrderItemController {
    constructor(private readonly orderItemService: OrderItemService){
        this.orderItemService = orderItemService;
    }
    
    async getAll(req: Request, res: Response){
        try{
            const orderItems = await this.orderItemService.findAll(makeSelectCondition(req.query, []));
            return res.json(orderItems);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async getOne(req: Request, res: Response){
        try{
            const orderItem = await this.orderItemService.findOneById(req.params.id);
            return res.json(orderItem);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async createOne(req: Request, res: Response){
        try{
            const orderItem = await this.orderItemService.createOne(req.body);
            return formatSuccess(res, orderItem, 201);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async patchOne(req: Request, res: Response){
        try{
            const orderItem = await this.orderItemService.patchOneById(req.params.id, req.body);
            return formatSuccess(res, orderItem);
        }catch(err: any){
            return formatError(res, err);
        }
    }
}