import { CartItemService } from "@modules/cartItem/cartItem.service";
import { Request } from 'express';
import { Response } from 'express';
import { formatError, formatSuccess } from '@common/helpers/responseFormatter';
import { makeSelectCondition } from "@common/helpers/QueryParser";

export class CartItemController {
    constructor(private readonly cartItemService: CartItemService){
        this.cartItemService = cartItemService;
    }
    
    async getAll(req: Request, res: Response){
        try{
            const cartItems = await this.cartItemService.findAll(makeSelectCondition(req.query, []));
            return res.json(cartItems);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async getOne(req: Request, res: Response){
        try{
            const cartItem = await this.cartItemService.findOneById(req.params.id);
            return res.json(cartItem);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async createOne(req: Request, res: Response){
        try{
            const { cart_id, cart_item } = await this.cartItemService.createOrUpdateOne(req.body, req['x-app-cart']);
            req.res?.cookie('x-app-cart', cart_id, {
                httpOnly: true,
                path: '/',
                signed: true
            })
            return formatSuccess(res, cart_item, 201);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async patchOne(req: Request, res: Response){
        try{
            const cartItem = await this.cartItemService.patchOneById(req.params.id, req.body);
            return formatSuccess(res, cartItem);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async deleteOne(req: Request, res: Response){
        try{
            const result = await this.cartItemService.deleteOneById(req.params.id);
            return formatSuccess(res, result);
        }catch(err: any){
            return formatError(res, err);
        }
    }
}