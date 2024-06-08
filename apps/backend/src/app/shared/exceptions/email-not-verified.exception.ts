import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@nx-angular-nestjs-authentication/models';

export class EmailNotVerifiedException extends HttpException {
    constructor(message: string) {
        super({ message, errorCode: ErrorCode.EMAIL_NOT_VERIFIED }, HttpStatus.UNAUTHORIZED);
    }
}
