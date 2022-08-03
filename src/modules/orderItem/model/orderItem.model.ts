import { BaseModel }  from '@core/objection-js/Model';
import { ProductModel } from '@modules/product/model/product.model';

export class OrderItemModel extends BaseModel {
    id?: number;
    order_id: number;
    product_id: number;
    quantity: number;
    per_price: number;
    after_discount_per_price: number;
    created_at?: Date;
    updated_at?: Date;
    Product?: ProductModel;

    static get tableName(){
        return 'order_items';
    }

    static get relationMappings() {
        return {
            Product: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: ProductModel,
                join: {
                    from: 'order_items.product_id',
                    to: 'products.id'
                }
            }
        }
    }
}