import { NextFunction, Request, Response } from "express";
import { formatError } from "@common/helpers/responseFormatter";
import { ForbiddenException } from '@core/exceptions';
import { Role } from "@common/enums";

export function authorize(...permittedRoles: string[]){
    return (req: Request, res: Response, next: NextFunction) => {
        try{
            const { user } = req;
            if(
                user && 
                user.roles && 
                Array.isArray(user.roles) && 
                permittedRoles.some((role) => user.roles.includes(role) || role == Role.ANY)
            ){
                next();
            }else throw new ForbiddenException('ACCESS_DENIED');
        }catch(err: any){
            return formatError(res, err);
        }
    }
}