import { BaseModel }  from '@core/objection-js/Model';
import { ProductModel } from '@modules/product/model/product.model';

export class CartItemModel extends BaseModel {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    created_at?: Date;
    updated_at?: Date;
    Product?: ProductModel;

    static get tableName(){
        return 'cart_items';
    }

    static get relationMappings(){
        return {
            Product: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: ProductModel,
                join: {
                    from: 'cart_items.product_id',
                    to: 'products.id'
                }
            }
        }
    }
}