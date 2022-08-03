import { BaseModel }  from '@core/objection-js/Model';
import { ProductModel } from '@modules/product/model/product.model';

export class DiscountModel extends BaseModel {
    id?: number;
    product_id: number;
    percentage: number;
    created_at?: Date;
    updated_at?: Date;
    Product?: ProductModel;

    static get tableName(){
        return 'discounts';
    }

    static get relationMappings() {
        return {
            Product: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: ProductModel,
                join: {
                    from: 'discounts.product_id',
                    to: 'products.id'
                }
            }
        }
    }
}