import { BaseModel }  from '@core/objection-js/Model';
import { OrderItemModel } from '@modules/orderItem/model/orderItem.model';
import { ProductModel } from '@modules/product/model/product.model';
import { UserModel } from '@modules/user/model/user.model';

export class OrderModel extends BaseModel {
    id?: number;
    user_id: number;
    amount: number;
    after_discount_amount: number;
    status: string;
    created_at?: Date;
    updated_at?: Date;
    OrderItems?: OrderItemModel[];
    User?: UserModel;
    Products?: ProductModel[];

    static get tableName(){
        return 'orders';
    }

    static get relationMappings(){
        return {
            OrderItems: {
                relation: BaseModel.HasManyRelation,
                modelClass: OrderItemModel,
                join: {
                    from: 'orders.id',
                    to: 'order_items.order_id'
                }
            },
            User: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: UserModel,
                join: {
                    from: 'orders.user_id',
                    to: 'users.id'
                }
            },
            Products: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: ProductModel,
                join: {
                    from: 'orders.id',
                    through: {
                        from: 'order_items.order_id',
                        to: 'order_items.product_id',
                    },
                    to: 'products.id'
                }
            }
        }
    }
}