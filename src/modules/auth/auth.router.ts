import { AuthController } from '@modules/auth/auth.controller';
import { Router } from 'express';
import * as RefreshTokenMiddleware from '@common/middleware/RefreshTokenMiddleware';

export class AuthRouter {
    constructor(
        private readonly authController: AuthController, 
        private readonly router: Router
    ){}
    
    v1ApiRoute(){
        //login
        this.router.post('/login', this.authController.login.bind(this.authController));

        //register
        this.router.post('/register', this.authController.register.bind(this.authController));

        //refresh token
        this.router.post(
            '/refresh-token', 
            RefreshTokenMiddleware.authenticateToken,
            RefreshTokenMiddleware.authenticateFingerprint, 
            this.authController.refreshToken.bind(this.authController)
        );
        return this.router;
    }
}