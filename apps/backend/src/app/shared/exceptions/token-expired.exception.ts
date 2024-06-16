import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@nx-angular-nestjs-authentication/models';

export class TokenExpiredException extends HttpException {
    constructor(message: string) {
        super({ message, errorCode: ErrorCode.EXPIRED_TOKEN }, HttpStatus.FORBIDDEN);
    }
}
