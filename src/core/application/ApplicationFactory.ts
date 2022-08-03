import * as express from 'express';
import { Application } from 'express';
import { AppModule } from '@src/app.module';
import { AppOptions } from './interface';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

class ApplicationFactoryClass {
    async create(module: AppModule, options?: AppOptions): Promise<Application> {
        const app = express();
        if(options?.staticFolder) app.use(express.static(options.staticFolder));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        if(options?.cookieParser){
            if(typeof options.cookieParser == 'boolean')
                app.use(cookieParser());
            else
                app.use(cookieParser(options.cookieParser));
        }
        app.use('/', module.router);
        return app;
    }
}

export const ApplicationFactory = new ApplicationFactoryClass();