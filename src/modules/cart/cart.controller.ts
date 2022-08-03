import { CartService } from "@modules/cart/cart.service";
import { Request } from 'express';
import { Response } from 'express';
import { formatError, formatSuccess } from '@common/helpers/responseFormatter';
import { makeSelectCondition } from "@common/helpers/QueryParser";

export class CartController {
    constructor(private readonly cartService: CartService){
        this.cartService = cartService;
    }
    
    async getAll(req: Request, res: Response){
        try{
            const carts = await this.cartService.findAll(makeSelectCondition(req.query, []));
            return res.json(carts);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async getOne(req: Request, res: Response){
        try{
            const cart = await this.cartService.findOneById(req.params.id);
            return res.json(cart);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async createOne(req: Request, res: Response){
        try{
            const cart = await this.cartService.createOne(req.body);
            return formatSuccess(res, cart, 201);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async patchOne(req: Request, res: Response){
        try{
            const cart = await this.cartService.patchOneById(req.params.id, req.body);
            return formatSuccess(res, cart);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async syncWithUser(req: Request, res: Response){
        try{
            const cart = await this.cartService.syncWithUser(req.user.user_id, req['x-app-cart']);
            return formatSuccess(res, cart);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async placeOrder(req: Request, res: Response){
        try{
            const order = await this.cartService.placeOrder(req.params.id, req.user.user_id);
            req.res?.cookie('x-app-cart', undefined, {
                httpOnly: true,
                path: '/',
                signed: true,
                expires: new Date()
            })
            return formatSuccess(res, order, 201);
        }catch(err: any){
            return formatError(res, err);
        }
    }
}