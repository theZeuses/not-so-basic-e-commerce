import { Router } from 'express';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthRouter } from '@modules/auth/auth.router';
import { AuthService } from '@modules/auth/auth.service';
import { UserService } from '@modules/user/user.service';
import { redisService } from '@common/services/RedisService';
import { UserModel } from '@modules/user/model/user.model';

export class AuthModule {
    public readonly authService: AuthService;
    public readonly router: Router;

    constructor(
        private readonly userService: UserService,
        private readonly userModel: typeof UserModel
    ){
        this.authService = new AuthService(this.userService, this.userModel, redisService);
        const authController = new AuthController(this.authService);
        const authRouter = new AuthRouter(authController, Router());

        this.router = Router();
        this.router.use('/api/v1/auth', authRouter.v1ApiRoute());
    }
}