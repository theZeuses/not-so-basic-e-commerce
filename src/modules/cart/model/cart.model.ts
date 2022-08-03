import { BaseModel }  from '@core/objection-js/Model';
import { CartItemModel } from '@modules/cartItem/model/cartItem.model';
import { ProductModel } from '@modules/product/model/product.model';
import { UserModel } from '@modules/user/model/user.model';

export class CartModel extends BaseModel {
    id?: number;
    user_id?: number;
    followedUp: boolean;
    created_at?: Date;
    updated_at?: Date;
    CartItems?: CartModel[];
    Products?: ProductModel[];
    User?: UserModel;

    static get tableName(){
        return 'carts';
    }

    static get relationMappings(){
        return {
            CartItems: {
                relation: BaseModel.HasManyRelation,
                modelClass: CartItemModel,
                join: {
                    from: 'carts.id',
                    to: 'cart_items.cart_id'
                }
            },
            Products: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: ProductModel,
                join: {
                    from: 'carts.id',
                    through: {
                        from: 'cart_items.cart_id',
                        to: 'cart_items.product_id',
                    },
                    to: 'products.id'
                }
            },
            User: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: UserModel,
                join: {
                    from: 'carts.user_id',
                    to: 'users.id'
                }
            }
        }
    }
}