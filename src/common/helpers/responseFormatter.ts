import { BadRequestException, ForbiddenException, InternalErrorException, NotFoundException, UnauthorizedException } from '@core/exceptions';
import { Response } from 'express';
import { UnprocessableEntityException } from '@core/exceptions';

/**
 * Generate appropriate response from error 
 * @param {Response} res
 * @param {Array<object>|object} err
 * @param {number} statusCode?
 * @returns {Express.Response}
 */
export function formatError(res: Response, err: Array<object> | object, statusCode?: number) : Response {
    if(
        err instanceof BadRequestException ||
        err instanceof NotFoundException ||
        err instanceof UnprocessableEntityException ||
        err instanceof UnauthorizedException ||
        err instanceof ForbiddenException
    ){
        return res.status(statusCode ?? err.statusCode).json(err);
    }else{
        return res.status(statusCode ?? 500).json(new InternalErrorException('SOMETHING_WENT_WRONG'));
    }
}


/**
 * Generate appropriate response from data
 * @param {Response} res
 * @param {any} data
 * @param {number=200} statusCode
 * @returns {Express.Response}
 */
export function formatSuccess(res: Response, data: any, statusCode: number = 200) : Response {
    return res.status(statusCode).json({
        statusCode: statusCode,
        data: data
    });
}