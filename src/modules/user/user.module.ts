import { Router } from 'express';
import { UserController } from '@modules/user/user.controller';
import { UserRouter } from '@modules/user/user.router';
import { UserService } from '@modules/user/user.service';
import { UserModel } from '@modules/user/model/user.model';

export class UserModule {
    public readonly userService: UserService;
    public readonly router: Router;

    constructor(
        private readonly userModel: typeof UserModel
    ){
        this.userService = new UserService(this.userModel);
        const userController = new UserController(this.userService);
        const userRouter = new UserRouter(userController, Router());

        this.router = Router();
        this.router.use('/api/v1/users', userRouter.v1ApiRoute());
    }
}