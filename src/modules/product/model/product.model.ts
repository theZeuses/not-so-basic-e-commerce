import { BaseModel }  from '@core/objection-js/Model';
import { CategoryModel } from '@modules/category/model/category.model';
import { DiscountModel } from '@modules/discount/model/discount.model';

export class ProductModel extends BaseModel {
    id?: number;
    name: string;
    price: number;
    photo: string;
    quantity?: number;
    quantity_unit?: string;
    weight?: number;
    weight_unit?: number;
    isPublished: boolean;
    description?: string;
    type?: string;
    rating?: number;
    category_id: number;
    created_at?: Date;
    updated_at?: Date;
    Category?: CategoryModel;
    Discount?: DiscountModel;

    static get tableName(){
        return 'products';
    }

    static get relationMappings() {
        return {
            Category: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: CategoryModel,
                join: {
                    from: 'products.category_id',
                    to: 'categories.id'
                }
            },
            Discount: {
                relation: BaseModel.HasOneRelation,
                modelClass: DiscountModel,
                join: {
                    from: 'products.id',
                    to: 'discounts.product_id'
                }
            }
        }
    }
}