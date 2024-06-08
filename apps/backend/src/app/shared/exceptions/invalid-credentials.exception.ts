import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@nx-angular-nestjs-authentication/models';

export class InvalidCredentialsException extends HttpException {
    constructor(message: string) {
        super({ message, errorCode: ErrorCode.INVALID_CREDENTIALS }, HttpStatus.UNAUTHORIZED);
    }
}
