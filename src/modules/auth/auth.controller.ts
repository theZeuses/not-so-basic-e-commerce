import { AuthService } from "@modules/auth/auth.service";
import { Request } from 'express';
import { Response } from 'express';
import { formatError, formatSuccess } from '@common/helpers/responseFormatter';

export class AuthController {
    constructor(private readonly authService: AuthService){
        this.authService = authService;
    }
    
    async login(req: Request, res: Response){
        try{
            const { auth_token, fingerprint } = await this.authService.signIn(req.body);
            req.res?.cookie('x-app-fingerprint', fingerprint, {
                httpOnly: true,
                path: '/',
                signed: true
            })
            return res.json(auth_token);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async register(req: Request, res: Response){
        try{
            const { auth_token, fingerprint } = await this.authService.register(req.body);
            req.res?.cookie('x-app-fingerprint', fingerprint, {
                httpOnly: true,
                path: '/',
                signed: true
            })
            return res.json(auth_token);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async refreshToken(req: Request, res: Response){
        try{
            const { auth_token, fingerprint } = await this.authService.refreshToken(req.user);
            req.res?.cookie('x-app-fingerprint', fingerprint, {
                httpOnly: true,
                path: '/',
                signed: true
            })
            return res.json(auth_token);
        }catch(err: any){
            return formatError(res, err);
        }
    }

    async logout(req: Request, res: Response){
        try{
            await this.authService.logout(req.user, req['x-app-fingerprint']);
            req.res?.cookie('x-app-fingerprint', undefined, {
                httpOnly: true,
                path: '/',
                signed: true,
                expires: new Date()
            })
            return formatSuccess(res, undefined);
        }catch(err: any){
            return formatError(res, err);
        }
    }
}