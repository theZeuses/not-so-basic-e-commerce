import { CartService } from '@modules/cart/cart.service';
import { CartModel } from '@modules/cart/model/cart.model';
import { CartItemModel } from '@modules/cartItem/model/cartItem.model';
import { cartStub } from '@modules/cart/test/stubs/cart.stub';
import { OrderModel } from '@modules/order/model/order.model';
import { OrderItemModel } from '@modules/orderItem/model/orderItem.model';
import { ProductModel } from '@modules/product/model/product.model';
import { Validator } from '@common/helpers/DtoValidator';

jest.mock("@modules/cart/model/cart.model");
jest.mock('@modules/cartItem/model/cartItem.model');
jest.mock('@modules/order/model/order.model');
jest.mock('@modules/orderItem/model/orderItem.model');
jest.mock('@modules/product/model/product.model');

let mockValidateFn = jest.fn();
jest.mock('@common/helpers/DtoValidator', () => {
    return {
        Validator: jest.fn().mockImplementation(() => {
            return {
                validate: mockValidateFn
            }
        })
    }
});

describe('CartService', () => {
    let cartService: CartService;
    
    beforeEach(() => {
        cartService = new CartService(
            CartModel, CartItemModel, ProductModel, OrderModel, OrderItemModel
        );

        jest.clearAllMocks();
    });

    describe("root", () => {
        it('should be defined', () => {
            expect(cartService).toBeDefined();
        });
    });

    describe('when findAll() is called', () => {
        it('should return a array of carts', async () => {
            const carts = [await cartService.findAll()];
            expect(carts).toEqual([cartStub()]);
        });
    });

    describe('when createOne() is called', () => {
        let cart;
        beforeEach(async () => {
            cart = await cartService.createOne(cartStub());
        });
        
        it('should instantiate validator', async () => {
            expect(Validator).toHaveBeenCalledTimes(1);
        });

        it('should call validate method of validator', async () => {
            expect(mockValidateFn).toHaveBeenCalled();
        });

        it('should return inserted cart', async () => {
            expect(cart).toEqual(cartStub());
        });
    });
});