import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@nx-angular-nestjs-authentication/models';

export class UniqueUserValueException extends HttpException {
    constructor(message: string) {
        super({ message, errorCode: ErrorCode.UNIQUE_USER_VALUE_CONSTRAINT }, HttpStatus.BAD_REQUEST);
    }
}
