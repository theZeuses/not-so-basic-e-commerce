import { UserModel } from '@modules/user/model/user.model';
import { CreateUserDto, PatchUserDto } from './dto';
import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@core/exceptions';
import { Validator } from '@common/helpers/DtoValidator';
import { ICondition } from '@core/objection-js/interfaces';

export class UserService {
    constructor(private readonly userModel: typeof UserModel){}

    async findAll(selectCondition?: ICondition) : Promise<UserModel[]> {
        try{
            return await this.userModel.query().selectByCondition(selectCondition).allowGraph('[Carts.Products,Orders.Products]');
        }catch(err){
            throw new BadRequestException('BAD_QUERY_STRING');
        }
    }

    async findOneById(id: string) : Promise<UserModel> {
        const user = await this.userModel.query().selectByCondition().where('id', id).first();
        if(!user) throw new NotFoundException('USER_NOT_FOUND');
        return user;
    }

    async findOneByEmail(email: string) : Promise<UserModel> {
        return await this.userModel.query().select().where('email', email).first();
    }

    async checkOneByEmail(email: string) : Promise<UserModel> {
        return this.userModel.query().select('id').where('email', email).first();
    }

    async createOne(dto: CreateUserDto) : Promise<UserModel> {
        const validator = new Validator();
        await validator.validate(dto, CreateUserDto);

        const user = await this.checkOneByEmail(dto.email);
        if(user) throw new UnprocessableEntityException('DUPLICATE_EMAIL');

        return this.userModel.query().insertAndFetch(dto);
    }

    async patchOneById(id: string, dto: PatchUserDto) : Promise<UserModel> {
        const validator = new Validator();
        await validator.validate(dto, PatchUserDto);

        const user = await this.findOneById(id);

        if(dto.email && user.email != dto.email){
            const user = await this.checkOneByEmail(dto.email);
            if(user && user.id != parseInt(id)) throw new UnprocessableEntityException('DUPLICATE_EMAIL');
        }

        return user.$query().patchAndFetch(dto);
    }
}