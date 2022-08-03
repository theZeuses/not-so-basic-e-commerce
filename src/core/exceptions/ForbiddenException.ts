import { BaseException } from './BaseException';

export class ForbiddenException extends BaseException {  
    constructor (errorCode: string) {
        super(403, errorCode)
    }
}