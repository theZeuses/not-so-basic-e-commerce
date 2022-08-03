import { NextFunction, Request, Response } from "express";
import { formatError } from "@common/helpers/responseFormatter";

export function parseSingedCookie(...cookieNames: string[]){
    return function (req: Request, res: Response, next: NextFunction){
        try{
            const { signedCookies } = req;
            cookieNames.map((cookieName) => {
                req[cookieName] = signedCookies[cookieName];
            })
            next();
        }catch(err: any){
            return formatError(res, err);
        }
    }
}