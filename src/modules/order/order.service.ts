import { OrderModel } from '@modules/order/model/order.model';
import { CreateOrderDto, PatchOrderDto } from './dto';
import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@core/exceptions';
import { Validator } from '@common/helpers/DtoValidator';
import { ICondition } from '@core/objection-js/interfaces';
import { OrderStatus } from '@common/enums';
import { UserModel } from '@modules/user/model/user.model';
import { OrderConfirmedNotification } from '@notifications/orderConfirmed/orderConfirmed.notification';

export class OrderService {

    constructor(
        private readonly orderModel: typeof OrderModel
    ){}

    async findAll(selectCondition?: ICondition) : Promise<OrderModel[]> {
        try{
            return await this.orderModel.query().selectByCondition(selectCondition).allowGraph('[OrderItems.Product,User,Products]');
        }catch(err){
            throw new BadRequestException('BAD_QUERY_STRING');
        }
    }

    async findOneById(id: string) : Promise<OrderModel> {
        const order = await this.orderModel.query().selectByCondition().where('id', id).first();
        if(!order) throw new NotFoundException('ORDER_NOT_FOUND');
        return order;
    }

    async createOne(dto: CreateOrderDto) : Promise<OrderModel> {
        const validator = new Validator();
        await validator.validate(dto, CreateOrderDto);

        return this.orderModel.query().insertAndFetch(dto);
    }

    async patchOneById(id: string, dto: PatchOrderDto) : Promise<OrderModel> {
        const validator = new Validator();
        await validator.validate(dto, PatchOrderDto);

        const order = await this.findOneById(id);

        return order.$query().patchAndFetch(dto);
    }

    async confirmOrder(id: string){
        const order = await this.findOneById(id);
        if(order.status != OrderStatus.CREATED) throw new UnprocessableEntityException('BAD_OPERATION');
        const updatedOrder = await order.$query().patchAndFetch({
            status: OrderStatus.CONFIRMED
        }).withGraphFetched('[User]').where('id', id);
        await this.notifyUserUponOrderConfirmation(updatedOrder, updatedOrder.User);
        return updatedOrder;
    }

    async notifyUserUponOrderConfirmation(order: OrderModel, user: UserModel){
        const notification = new OrderConfirmedNotification();
        return notification.mail({
            receiver: {
                email: user.email
            },
            payload: {
                name: user.name,
                order_id: order.id
            }
        })
    }

    async markOrderAsDelivered(id: string){
        const order = await this.findOneById(id);
        if(order.status != OrderStatus.CONFIRMED) throw new UnprocessableEntityException('BAD_OPERATION');
        return order.$query().patchAndFetch({
            status: OrderStatus.DELIVERED
        }).where('id', id);
    }
}