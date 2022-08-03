import * as cors from 'cors';
import * as dotenv from "dotenv";
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { ApplicationFactory } from '@core/application';
import { AppOptions } from '@core/application/interface';
import { AppModule } from '@src/app.module';
import { Application } from 'express';
import { truncateTables } from '@scripts/knex_truncate_tables';
import { CartModule } from '@modules/cart/cart.module';
import { CartModel } from '@modules/cart/model/cart.model';
import { CartItemModel } from '@modules/cartItem/model/cartItem.model';
import { ProductModel } from '@modules/product/model/product.model';
import { OrderModel } from '@modules/order/model/order.model';
import { OrderItemModel } from '@modules/orderItem/model/orderItem.model';

dotenv.config();

jest.setTimeout(20000);

describe('Cart (e2e)', () => {
    let app: Application;

    beforeAll(async () => {
        const appOptions: AppOptions = {
            staticFolder: 'public',
            cookieParser: process.env.COOKIE_SECRET
        }
        app = await ApplicationFactory.create(new CartModule(
            CartModel,
            CartItemModel,
            ProductModel,
            OrderModel,
            OrderItemModel
        ) as any, appOptions);
    
        app.use(cors({credentials: true, origin: true}));

        await truncateTables();
    });

    let insertedCartId;
    describe('POST /api/v1/carts', () => {
        it('should should return error because of bad request payload', async () => {
            const response = await request(app)
            .post('/api/v1/carts')
            .send({
                user_id: 1
            });
            expect(response.statusCode).toBe(400);
        });

        it('should successfully insert and return a cart', async () => {
            const response = await request(app)
            .post('/api/v1/carts')
            .send({
                user_id: 1,
                followedUp: false
            });
            expect(response.statusCode).toBe(201);
            expect(response.body.data).toHaveProperty('user_id', 1);
            insertedCartId = response.body.data.id;
        });
    });

    describe('GET /api/v1/carts', () => {
        it('should should return error because of bad query string', async () => {
            const response = await request(app)
            .get('/api/v1/carts?User');
            expect(response.statusCode).toBe(400);
        });

        it('should return an array of carts', async () => {
            const response = await request(app)
            .get('/api/v1/carts?id=1&q=search&w=CartItems&o=1&l=1');
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /api/v1/carts/:id', () => {
        it("should should return error when id doesn't match", async () => {
            const response = await request(app)
            .get(`/api/v1/carts/${insertedCartId + 1}`);
            expect(response.statusCode).toBe(404);
        });

        it('should return a cart', async () => {
            const response = await request(app)
            .get(`/api/v1/carts/${insertedCartId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(insertedCartId);
        });
    });
});