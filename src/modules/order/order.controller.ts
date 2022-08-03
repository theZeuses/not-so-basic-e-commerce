import { OrderService } from "@modules/order/order.service";
import { Request } from 'express';
import { Response } from 'express';
import { formatError, formatSuccess } from '@common/helpers/responseFormatter';
import { makeSelectCondition } from "@common/helpers/QueryParser";

export class OrderController {
    constructor(private readonly orderService: OrderService){
        this.orderService = orderService;
    }
    
    async getAll(req: Request, res: Response){
        try{
            const orders = await this.orderService.findAll(makeSelectCondition(req.query, []));
            return res.json(orders);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async getOne(req: Request, res: Response){
        try{
            const order = await this.orderService.findOneById(req.params.id);
            return res.json(order);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async createOne(req: Request, res: Response){
        try{
            const order = await this.orderService.createOne(req.body);
            return formatSuccess(res, order, 201);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async patchOne(req: Request, res: Response){
        try{
            const order = await this.orderService.patchOneById(req.params.id, req.body);
            return formatSuccess(res, order);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async confirmOne(req: Request, res: Response){
        try{
            const order = await this.orderService.confirmOrder(req.params.id);
            return formatSuccess(res, order);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async markOneAsDelivered(req: Request, res: Response){
        try{
            const order = await this.orderService.markOrderAsDelivered(req.params.id);
            return formatSuccess(res, order);
        }catch(err: any){
            return formatError(res, err);
        }
    }
}