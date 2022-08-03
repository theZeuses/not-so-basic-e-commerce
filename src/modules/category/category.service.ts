import { CategoryModel } from '@modules/category/model/category.model';
import { CreateCategoryDto, PatchCategoryDto } from './dto';
import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@core/exceptions';
import { Validator } from '@common/helpers/DtoValidator';
import { ICondition } from '@core/objection-js/interfaces';

export class CategoryService {
    constructor(private readonly categoryModel: typeof CategoryModel){}

    async findAll(selectCondition?: ICondition) : Promise<CategoryModel[]> {
        try{
            return await this.categoryModel.query().selectByCondition(selectCondition).allowGraph('Products');
        }catch(err){
            throw new BadRequestException('BAD_QUERY_STRING');
        }
    }

    async findOneById(id: string) : Promise<CategoryModel> {
        const category = await this.categoryModel.query().selectByCondition().where('id', id).first();
        if(!category) throw new NotFoundException('CATEGORY_NOT_FOUND');
        return category;
    }

    async createOne(dto: CreateCategoryDto) : Promise<CategoryModel> {
        const validator = new Validator();
        await validator.validate(dto, CreateCategoryDto);

        return this.categoryModel.query().insertAndFetch(dto);
    }

    async patchOneById(id: string, dto: PatchCategoryDto) : Promise<CategoryModel> {
        const validator = new Validator();
        await validator.validate(dto, PatchCategoryDto);

        const category = await this.findOneById(id);

        return category.$query().patchAndFetch(dto);
    }
}