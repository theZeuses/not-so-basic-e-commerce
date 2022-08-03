import { BaseException } from './BaseException';

export class UnauthorizedException extends BaseException {  
    constructor (errorCode: string) {
        super(401, errorCode)
    }
}