import { BaseModel }  from '@core/objection-js/Model';
import { ProductModel } from '@modules/product/model/product.model';

export class CategoryModel extends BaseModel {
    id?: number;
    name: string;
    icon: string;
    created_at?: Date;
    updated_at?: Date;
    Products?: ProductModel[];

    static get tableName(){
        return 'categories';
    }

    static get relationMappings(){
        return {
            Products: {
                relation: BaseModel.HasManyRelation,
                modelClass: ProductModel,
                join: {
                    from: 'categories.id',
                    to: 'products.category_id'
                }
            }
        }
    }
}