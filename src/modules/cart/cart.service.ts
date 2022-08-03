import { CartModel } from '@modules/cart/model/cart.model';
import { CreateCartDto, PatchCartDto } from './dto';
import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@core/exceptions';
import { Validator } from '@common/helpers/DtoValidator';
import { ICondition } from '@core/objection-js/interfaces';
import { ProductModel } from '@modules/product/model/product.model';
import { OrderModel } from '@modules/order/model/order.model';
import { OrderStatus } from '@common/enums';
import { OrderItemModel } from '@modules/orderItem/model/orderItem.model';
import { CartItemModel } from '@modules/cartItem/model/cartItem.model';

export class CartService {
    constructor(
        private readonly cartModel: typeof CartModel,
        private readonly cartItemModel: typeof CartItemModel,
        private readonly productModel: typeof ProductModel,
        private readonly orderModel: typeof OrderModel,
        private readonly orderItemModel: typeof OrderItemModel
    ){}

    async findAll(selectCondition?: ICondition) : Promise<CartModel[]> {
        try{
            return await this.cartModel.query().selectByCondition(selectCondition).allowGraph('[CartItems.Product,Products]');
        }catch(err){
            throw new BadRequestException('BAD_QUERY_STRING');
        }
    }

    async findOneById(id: string) : Promise<CartModel> {
        const cart = await this.cartModel.query().selectByCondition().where('id', id).first();
        if(!cart) throw new NotFoundException('CART_NOT_FOUND');
        return cart;
    }

    async createOne(dto: CreateCartDto) : Promise<CartModel> {
        const validator = new Validator();
        await validator.validate(dto, CreateCartDto);

        return this.cartModel.query().insertAndFetch(dto);
    }

    async patchOneById(id: string, dto: PatchCartDto) : Promise<CartModel> {
        const validator = new Validator();
        await validator.validate(dto, PatchCartDto);

        const cart = await this.findOneById(id);

        return cart.$query().patchAndFetch(dto);
    }

    async syncWithUser(user_id: string, cart_id: string | undefined){
        if(!cart_id) return this.createOne({
            user_id: parseInt(user_id),
            followedUp: false
        });
        const cart = await this.findOneById(cart_id);
        return cart.$query().patchAndFetch({
            user_id
        })
    }

    async getNotFollowedUpCarts(hours: number){
        const date = new Date();
        date.setHours(date.getHours() - hours);
        return this.cartModel.query().select(
            [
                'carts.id',
                'carts.user_id',
                'carts.followedUp',
                'carts.updated_at'
            ],
            this.cartModel.relatedQuery('Products').whereExists(this.productModel.relatedQuery('Discount').select(1))
            .count('Products.id').as('discounted_product_count')
        ).withGraphFetched('User')
        .modifyGraph('User', builder => {
            builder.select(['id', 'name', 'email'])
        }).whereExists(this.cartModel.relatedQuery('CartItems').select(1))
        .andWhere('updated_at', '<', date).andWhere('followedUp', false);
    }

    async markCartsAsFollowedUp(ids: number[]){
        return this.cartModel.query().patch({
            followedUp: true
        }).whereIn('id', ids);
    }

    async placeOrder(id: string, user_id: string){
        const cart = await this.cartModel.query().withGraphFetched(`[CartItems.Product.Discount]`).where('id', id).andWhere('user_id', user_id).first();
        if(!cart) throw new NotFoundException("CART_NOT_FOUND");
        try {
            const order = await this.cartModel.transaction(async trx => {
                let totalPrice = 0;
                let totalDiscountedPrice = 0;
                const cartItemIds = [];

                //generate order items from cart items and calculate total price & discounted price
                const mappedOrderItems = cart.CartItems.map((cartItem) => {
                    const quantity = cartItem.quantity;
                    const perPrice = cartItem.Product.price;
                    const discountedPerPrice = cartItem.Product.Discount ? 
                    (perPrice - (cartItem.Product.Discount.percentage * perPrice / 100)) : 0;
                    totalPrice += perPrice * quantity;
                    totalDiscountedPrice += discountedPerPrice * quantity;
                    if(quantity == 0) return undefined;
                    cartItemIds.push(cartItem.id);
                    return {
                        product_id: cartItem.product_id,
                        quantity: cartItem.quantity,
                        per_price: perPrice,
                        after_discount_per_price: discountedPerPrice
                    } as OrderItemModel;
                });
                //check if cart is empty
                if(totalPrice == 0) throw new UnprocessableEntityException('EMPTY_CART');

                //insert the order
                const order = await this.orderModel.query(trx).insertAndFetch({
                    user_id: cart.user_id,
                    amount: totalPrice,
                    after_discount_amount: totalDiscountedPrice,
                    status: OrderStatus.CREATED
                });

                const filteredOrderItems = mappedOrderItems.filter((item) => {
                    if(item != undefined) return item.order_id = order.id;
                });

                //insert the order items
                await this.orderItemModel.knexQuery().transacting(trx).insert(filteredOrderItems);

                //delete the cart and cart items
                await this.cartItemModel.query(trx).whereIn('id', cartItemIds).delete();
                await this.cartModel.query(trx).where('id', cart.id).delete();
                
                return order;
            });
            return await this.orderModel.query().withGraphFetched(`[OrderItems]`).where('id', order.id).first();
        } catch (err) {
            throw err;
        }
    }
}