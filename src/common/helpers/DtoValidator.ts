import { validate, ValidatorOptions } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '@core/exceptions';

export class Validator {
    constructor(private options: ValidatorOptions = {
        whitelist: true,
        forbidNonWhitelisted: true
    }){
    }
    async validate(value: any, classConstructor: any) {
        if (!classConstructor || !this.toValidate(classConstructor)) {
            return value;
        }
        const object = plainToInstance(classConstructor, value);
        const errors = await validate(object, this.options);
        if (errors.length > 0) {
            throw new BadRequestException('BAD_REQUEST_PAYLOAD');
        }
        return object;
    }

    private toValidate(classConstructor: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(classConstructor);
    }
}