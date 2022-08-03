import { DiscountModel } from '@modules/discount/model/discount.model';
import { CreateDiscountDto, PatchDiscountDto } from './dto';
import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@core/exceptions';
import { Validator } from '@common/helpers/DtoValidator';
import { ICondition } from '@core/objection-js/interfaces';

export class DiscountService {
    constructor(private readonly discountModel: typeof DiscountModel){}

    async findAll(selectCondition?: ICondition) : Promise<DiscountModel[]> {
        try{
            return await this.discountModel.query().selectByCondition(selectCondition).allowGraph('[Product]');
        }catch(err){
            throw new BadRequestException('BAD_QUERY_STRING');
        }
    }

    async findOneById(id: string) : Promise<DiscountModel> {
        const discount = await this.discountModel.query().selectByCondition().where('id', id).first();
        if(!discount) throw new NotFoundException('DISCOUNT_NOT_FOUND');
        return discount;
    }

    async createOne(dto: CreateDiscountDto) : Promise<DiscountModel> {
        const validator = new Validator();
        await validator.validate(dto, CreateDiscountDto);

        return this.discountModel.query().insertAndFetch(dto);
    }

    async patchOneById(id: string, dto: PatchDiscountDto) : Promise<DiscountModel> {
        const validator = new Validator();
        await validator.validate(dto, PatchDiscountDto);

        const discount = await this.findOneById(id);

        return discount.$query().patchAndFetch(dto);
    }
}