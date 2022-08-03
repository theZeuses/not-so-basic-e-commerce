import { UserService } from "@modules/user/user.service";
import { Request } from 'express';
import { Response } from 'express';
import { formatError, formatSuccess } from '@common/helpers/responseFormatter';
import { makeSelectCondition } from "@common/helpers/QueryParser";

export class UserController {
    constructor(private readonly userService: UserService){
        this.userService = userService;
    }
    
    async getAll(req: Request, res: Response){
        try{
            const users = await this.userService.findAll(makeSelectCondition(req.query, [
                'name',
                'email'
            ]));
            return res.json(users);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async getOne(req: Request, res: Response){
        try{
            const user = await this.userService.findOneById(req.params.id);
            return res.json(user);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async createOne(req: Request, res: Response){
        try{
            const user = await this.userService.createOne(req.body);
            return formatSuccess(res, user, 201);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async patchOne(req: Request, res: Response){
        try{
            const user = await this.userService.patchOneById(req.params.id, req.body);
            return formatSuccess(res, user);
        }catch(err: any){
            return formatError(res, err);
        }
    }
}