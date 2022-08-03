import { UserController } from '@modules/user/user.controller';
import { Router } from 'express';
import * as BearerTokenMiddleware from '@common/middleware/BearerTokenMiddleware';
import * as AuthorizationMiddleware from '@common/middleware/AuthorizationMiddleware';
import { Role } from '@common/enums';

export class UserRouter {
    constructor(
        private readonly userController: UserController, 
        private readonly router: Router
    ){}
    
    v1ApiRoute(){
        //get all users (with filters, search, relationships, relationshipFilter, pagination)
        this.router.get(
            '/', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ADMIN),
            this.userController.getAll.bind(this.userController)
        );

        //insert a user
        this.router.post(
            '/', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ADMIN),
            this.userController.createOne.bind(this.userController)
        );

        //get a user
        this.router.get(
            '/:id',
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ANY), 
            this.userController.getOne.bind(this.userController)
        );

        //patch a user
        this.router.patch(
            '/:id', 
            BearerTokenMiddleware.authenticate,
            AuthorizationMiddleware.authorize(Role.ANY),
            this.userController.patchOne.bind(this.userController)
        );

        return this.router;
    }
}