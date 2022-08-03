import { BaseException } from './BaseException';

export class NotFoundException extends BaseException {  
    constructor (errorCode: string) {
        super(404, errorCode)
    }
}