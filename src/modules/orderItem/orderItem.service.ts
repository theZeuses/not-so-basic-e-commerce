import { OrderItemModel } from '@modules/orderItem/model/orderItem.model';
import { CreateOrderItemDto, PatchOrderItemDto } from './dto';
import { BadRequestException, NotFoundException } from '@core/exceptions';
import { Validator } from '@common/helpers/DtoValidator';
import { ICondition } from '@core/objection-js/interfaces';

export class OrderItemService {
    constructor(private readonly orderItemModel: typeof OrderItemModel){}

    async findAll(selectCondition?: ICondition) : Promise<OrderItemModel[]> {
        try{
            return await this.orderItemModel.query().selectByCondition(selectCondition).allowGraph('[Product]');
        }catch(err){
            throw new BadRequestException('BAD_QUERY_STRING');
        }
    }

    async findOneById(id: string) : Promise<OrderItemModel> {
        const orderItem = await this.orderItemModel.query().selectByCondition().where('id', id).first();
        if(!orderItem) throw new NotFoundException('ORDER_ITEM_NOT_FOUND');
        return orderItem;
    }

    async createOne(dto: CreateOrderItemDto) : Promise<OrderItemModel> {
        const validator = new Validator();
        await validator.validate(dto, CreateOrderItemDto);

        return this.orderItemModel.query().insertAndFetch(dto);
    }

    async patchOneById(id: string, dto: PatchOrderItemDto) : Promise<OrderItemModel> {
        const validator = new Validator();
        await validator.validate(dto, PatchOrderItemDto);

        const orderItem = await this.findOneById(id);

        return orderItem.$query().patchAndFetch(dto);
    }
}