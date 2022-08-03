import { NextFunction, Request, Response } from "express";
import { formatError } from "@common/helpers/responseFormatter";
import { ForbiddenException } from '@core/exceptions';
import { authenticateRefreshToken } from "@common/helpers/jwtHelper";
import { AuthService } from '@modules/auth/auth.service';
import { UserService } from "@modules/user/user.service";
import { redisService } from "@common/services/RedisService";
import * as argon from 'argon2';
import { UserModel } from '@modules/user/model/user.model';

export function authenticateToken(req: Request, res: Response, next: NextFunction){
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) throw new ForbiddenException('REFRESH_TOKEN_MISSING');
        const payload = authenticateRefreshToken(token);
        if(!payload) throw new ForbiddenException('ACCESS_DENIED')
        req.user = payload;
        next()
    }catch(err: any){
        return formatError(res, err);
    }
}

export async function authenticateFingerprint(req: Request, res: Response, next: NextFunction){
    try{
        const { user, signedCookies } = req;
        if(!user || !signedCookies || !signedCookies['x-app-fingerprint']) throw new ForbiddenException('ACCESS_DENIED');

        //check if it is a valid session's cookie or already been logged out 
        const authService = new AuthService(new UserService(UserModel), UserModel, redisService);
        const valid = await authService.isValidSession(user.user_id, user.session);
        if(!valid) throw new ForbiddenException('ACCESS_DENIED');

        //verify the fingerprint's authenticity
        if(!await argon.verify(user.fingerprint, signedCookies['x-app-fingerprint'])){
            await authService.deleteSession(user.user_id, user.session);
            throw new ForbiddenException('ACCESS_DENIED');
        }
        req['x-app-fingerprint'] = signedCookies['x-app-fingerprint'];
        next();
    }catch(err: any){
        return formatError(res, err);
    }
}