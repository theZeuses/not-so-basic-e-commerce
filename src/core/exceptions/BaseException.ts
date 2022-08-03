export class BaseException extends Error {  
    error: string;
    statusCode?: number;
    errorCode?: string;

    constructor (statusCode: number, errorCode: string) {
        super(errorCode)
        Error.captureStackTrace(this, this.constructor);
        this.error = this.constructor.name;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
    }
}