import { ProductModel } from '@modules/product/model/product.model';
import { CreateProductDto, PatchProductDto } from './dto';
import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@core/exceptions';
import { Validator } from '@common/helpers/DtoValidator';
import { ICondition } from '@core/objection-js/interfaces';

export class ProductService {
    constructor(private readonly productModel: typeof ProductModel){}

    async findAll(selectCondition?: ICondition) : Promise<ProductModel[]> {
        try{
            return await this.productModel.query().selectByCondition(selectCondition).allowGraph('[Category,Discount]');
        }catch(err){
            throw new BadRequestException('BAD_QUERY_STRING');
        }
    }

    async findOneById(id: string) : Promise<ProductModel> {
        const product = await this.productModel.query().selectByCondition().where('id', id).first();
        if(!product) throw new NotFoundException('PRODUCT_NOT_FOUND');
        return product;
    }

    async findPublishedOneById(id: string) : Promise<ProductModel> {
        const product = await this.productModel.query().selectByCondition().where('id', id).andWhere('isPublished', true).first();
        if(!product) throw new NotFoundException('PRODUCT_NOT_FOUND');
        return product;
    }

    async createOne(dto: CreateProductDto) : Promise<ProductModel> {
        const validator = new Validator();
        await validator.validate(dto, CreateProductDto);

        return this.productModel.query().insertAndFetch(dto);
    }

    async patchOneById(id: string, dto: PatchProductDto) : Promise<ProductModel> {
        const validator = new Validator();
        await validator.validate(dto, PatchProductDto);

        const product = await this.findOneById(id);

        return product.$query().patchAndFetch(dto);
    }

    async publishOneById(id: string){
        const product = await this.findOneById(id);
        return product.$query().patchAndFetch({
            isPublished: true
        });
    }

    async unpublishOneById(id: string){
        const product = await this.findOneById(id);
        return product.$query().patchAndFetch({
            isPublished: false
        });
    }
}