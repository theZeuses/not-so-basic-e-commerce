import { BaseException } from './BaseException';

export class BadRequestException extends BaseException {  
    constructor (errorCode: string) {
        super(400, errorCode)
    }
}