import { NextFunction, Request, Response } from "express";
import { formatError } from "@common/helpers/responseFormatter";
import { ForbiddenException, UnauthorizedException } from '@core/exceptions';
import { authenticateBearerToken } from "@common/helpers/jwtHelper";

export function authenticate(req: Request, res: Response, next: NextFunction){
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) throw new UnauthorizedException('NOT_AUTHENTICATED');
        const payload = authenticateBearerToken(token);
        if(!payload) throw new ForbiddenException('INVALID_TOKEN');
        req.user = payload;
        next()
    }catch(err: any){
        return formatError(res, err);
    }
}

export function authenticateIfPropertyAndMatch(propertyName: string){
    return function (req: Request, res: Response, next: NextFunction){
        try{
            if(!req.body[propertyName]){
                next();
            }else{
                const authHeader = req.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];
                if (!token) throw new UnauthorizedException('NOT_AUTHENTICATED');
                const payload = authenticateBearerToken(token);
                if(!payload) throw new ForbiddenException('INVALID_TOKEN');
                if(payload['user_id'] != req.body[propertyName]) throw new ForbiddenException('NOT_AUTHORIZED');
                req.user = payload;
                next();
            }
        }catch(err: any){
            return formatError(res, err);
        }
    }
}