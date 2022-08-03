import * as cors from 'cors';
import * as dotenv from "dotenv";
import { AddressInfo } from 'net';
import { ApplicationFactory } from '@core/application';
import { AppModule } from '@src/app.module';
import { AppOptions } from '@core/application/interface';
dotenv.config();


async function bootstrap(){
    const appOptions: AppOptions = {
        staticFolder: 'public',
        cookieParser: process.env.COOKIE_SECRET
    }
    const app = await ApplicationFactory.create(new AppModule(), appOptions);
    
    app.use(cors({credentials: true, origin: true}));
    
    
    const server = await app.listen(process.env.PORT || 8001, () => {
        let binding: string | number | AddressInfo | null;
        if(typeof server.address() === 'string'){
            binding = server.address();
        }else{
            let addr = server.address() as AddressInfo;
            binding = addr.port;
        }
        console.log(`Listening Backend API on port ${binding}`);
    });
}

bootstrap();


// console.log(require('crypto').randomBytes(64).toString('hex'));
