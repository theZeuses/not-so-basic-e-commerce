import { BaseModel } from "@core/objection-js/Model";
import { CartModel } from '@modules/cart/model/cart.model';
import { OrderModel } from "@modules/order/model/order.model";

export class UserModel extends BaseModel {
    id?: number;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    phone_number?: string;
    address: string;
    role: string;
    created_at?: Date;
    updated_at?: Date;

    static get tableName(){
        return 'users';
    }

    static get hidden() {
        return ['password'];
    }

    static get hashes(){
        return ['password'];
    }

    static get relationMappings(){
        return {
            Carts: {
                relation: BaseModel.HasManyRelation,
                modelClass: CartModel,
                join: {
                    from: 'users.id',
                    to: 'carts.user_id'
                }
            },
            Orders: {
                relation: BaseModel.HasManyRelation,
                modelClass: OrderModel,
                join: {
                    from: 'users.id',
                    to: 'orders.user_id'
                }
            }
        }
    }
}