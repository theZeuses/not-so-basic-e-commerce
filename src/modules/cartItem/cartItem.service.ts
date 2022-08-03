import { CartItemModel } from '@modules/cartItem/model/cartItem.model';
import { CreateCartItemDto, CreateOrUpdateCartItemDto, PatchCartItemDto } from './dto';
import { BadRequestException, NotFoundException } from '@core/exceptions';
import { Validator } from '@common/helpers/DtoValidator';
import { ICondition } from '@core/objection-js/interfaces';
import { CartService } from '@modules/cart/cart.service';
import { ProductService } from '@modules/product/product.service';

export class CartItemService {
    constructor(
        private readonly cartItemModel: typeof CartItemModel,
        private readonly cartService: CartService,
        private readonly productService: ProductService
    ){}

    async findAll(selectCondition?: ICondition) : Promise<CartItemModel[]> {
        try{
            return await this.cartItemModel.query().selectByCondition(selectCondition).allowGraph('[Product]');
        }catch(err){
            throw new BadRequestException('BAD_QUERY_STRING');
        }
    }

    async findOneById(id: string) : Promise<CartItemModel> {
        const cartItem = await this.cartItemModel.query().selectByCondition().where('id', id).first();
        if(!cartItem) throw new NotFoundException('CART_ITEM_NOT_FOUND');
        return cartItem;
    }

    async createOne(dto: CreateCartItemDto) : Promise<CartItemModel> {
        const validator = new Validator();
        await validator.validate(dto, CreateCartItemDto);

        return this.cartItemModel.query().insertAndFetch(dto);
    }

    async createOrUpdateOne(dto: CreateOrUpdateCartItemDto, cart_id?: string) {
        const validator = new Validator();
        await validator.validate(dto, CreateOrUpdateCartItemDto);
        await this.productService.findPublishedOneById(dto.product_id.toString());
        
        if(!cart_id){
            const cart = await this.cartService.createOne({
                followedUp: false,
                user_id: dto.user_id
            });
            cart_id = cart.id.toString();
        }else{
            try{
                await this.cartService.findOneById(cart_id);
            }catch(err){
                const cart = await this.cartService.createOne({
                    followedUp: false,
                    user_id: dto.user_id
                });
                cart_id = cart.id.toString();
            }
        }

        let cart_item = await this.cartItemModel.query().select(['id', 'quantity']).where({
            cart_id,
            product_id: dto.product_id
        }).first();

        if(cart_item){
            let quantity = cart_item.quantity + dto.quantity;
            quantity = quantity < 0 ? 0 : quantity;
            cart_item = await cart_item.$query().patchAndFetch({ quantity });
        }else{
            cart_item = await this.cartItemModel.query().insertAndFetch({
                cart_id,
                product_id: dto.product_id,
                quantity: dto.quantity
            });
        }
        return{
            cart_id,
            cart_item
        }
    }

    async patchOneById(id: string, dto: PatchCartItemDto) : Promise<CartItemModel> {
        const validator = new Validator();
        await validator.validate(dto, PatchCartItemDto);

        const cartItem = await this.findOneById(id);

        return cartItem.$query().patchAndFetch(dto);
    }

    async deleteOneById(id: string) {
        return {
            affected_row_count: await this.cartItemModel.query().deleteById(id)
        }
    }
}