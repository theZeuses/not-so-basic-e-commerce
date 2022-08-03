import { ProductDto } from '@modules/product/dto';

export const productStub = () : ProductDto => {
    return {
        id: 1,
        name: "Product",
        price: 100,
        photo: 'path/to/photo',
        quantity: 1,
        quantity_unit: 'piece',
        weight: 200,
        weight_unit:'gm',
        type: 'Type',
        description: 'description',
        isPublished: true,
        category_id: 1,
        rating: 4
    }
}