import { BaseException } from './BaseException';

export class UnprocessableEntityException extends BaseException {  
    constructor (errorCode: string) {
        super(422, errorCode)
    }
}