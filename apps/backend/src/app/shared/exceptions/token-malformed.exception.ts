import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@nx-angular-nestjs-authentication/models';

export class TokenMalformedException extends HttpException {
    constructor(message: string) {
        super({ message, errorCode: ErrorCode.TOKEN_MALFORMED }, HttpStatus.FORBIDDEN);
    }
}
