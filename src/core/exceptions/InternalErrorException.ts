import { BaseException } from './BaseException';

export class InternalErrorException extends BaseException {  
    constructor (errorCode: string) {
        super(500, errorCode)
    }
}