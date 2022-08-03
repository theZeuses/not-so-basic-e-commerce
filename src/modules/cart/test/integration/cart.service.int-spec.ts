import { BadRequestException } from "@core/exceptions";
import { CartService } from "@modules/cart/cart.service";
import { CartModel } from "@modules/cart/model/cart.model";
import { CartItemModel } from "@modules/cartItem/model/cartItem.model";
import { OrderModel } from "@modules/order/model/order.model";
import { OrderItemModel } from "@modules/orderItem/model/orderItem.model";
import { ProductModel } from "@modules/product/model/product.model";
import { truncateTables } from '@scripts/knex_truncate_tables';
import { Validator } from '@common/helpers/DtoValidator';
import { CreateCartDto } from '../../dto/create-cart.dto';

jest.setTimeout(20000);

describe('CartService (int)', () => {
    let cartService: CartService;
    
    beforeAll(async () => {
        cartService = new CartService(
            CartModel, CartItemModel, ProductModel, OrderModel, OrderItemModel
        );

        await truncateTables();
    });

    describe("root", () => {
        it('should be defined', () => {
            expect(cartService).toBeDefined();
        });
    });

    describe('when createOne() is called', () => {
        describe('with proper dto', () => {
            let dto: CreateCartDto = {
                user_id: 1,
                followedUp: false
            }
            let cart;
            beforeAll(async () => {
                jest.spyOn(Validator.prototype, 'validate');
                cart = await cartService.createOne(dto);
            });
            it('should call validate of validator', () => {
                expect(Validator.prototype.validate).toHaveBeenCalledWith(dto, CreateCartDto);
            });
            it('should return inserted cart', () => {
                expect(cart).toHaveProperty('user_id', dto.user_id);
            });
        });
        describe('with improper dto', () => {
            let dto = {
                user_id: 1
            }
            it('should call validate of validator', () => {
                jest.spyOn(Validator.prototype, 'validate');
                cartService.createOne(dto as CreateCartDto).catch(err => {});
                expect(Validator.prototype.validate).toHaveBeenCalledWith(dto, CreateCartDto);
            });
            it('should throw an error', () => {
                cartService.createOne(dto as CreateCartDto).catch(err => {
                    expect(err).toBeInstanceOf(BadRequestException);
                });
            });
        });
    });

    describe('when findAll() is called', () => {
        describe('with proper relationship and column names', () => {
            it('should return a array of carts', async () => {
                const carts = await cartService.findAll({
                    attributes: ['id'],
                    relationships: 'CartItems'
                });
                expect(Array.isArray(carts)).toBe(true);
            });
        });
        describe('with improper column name', () => {
            it('should throw an exception', async () => {
                cartService.findAll({
                    attributes: ['improper_id']
                }).catch(err => {
                    expect(err).toBeInstanceOf(BadRequestException);
                });
            });
        });

        describe('with unregistered relationship name', () => {
            it('should throw an exception', async () => {
                cartService.findAll({
                    relationships: 'User'
                }).catch(err => {
                    expect(err).toBeInstanceOf(BadRequestException);
                });
            });
        });
    });
});