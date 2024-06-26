import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import * as http from 'http';
import { ErrorResponse } from '../shared/models';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | object = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const responseMessage = exception.getResponse();

            if (typeof responseMessage === 'object' && responseMessage['message']) {
                message = responseMessage['message'];
            } else {
                message = responseMessage;
            }
        }

        const statusText = http.STATUS_CODES[status];
        const errorCode = exception instanceof HttpException ? exception.getResponse()['errorCode'] : undefined;

        const errorResponse = new ErrorResponse(
            status,
            statusText,
            message.toString(),
            new Date().toISOString(),
            request.url,
            errorCode
        );

        this.logger.error(`[${status}] ${message}`, exception.toString());

        response.status(status).json(errorResponse);
    }
}
