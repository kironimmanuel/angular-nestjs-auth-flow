import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@nx-angular-nestjs-authentication/models';

export class UserNotFoundException extends HttpException {
    constructor(message: string) {
        super({ message, errorCode: ErrorCode.USER_NOT_FOUND }, HttpStatus.NOT_FOUND);
    }
}
