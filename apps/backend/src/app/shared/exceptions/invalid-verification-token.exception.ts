import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@nx-angular-nestjs-authentication/models';

export class InvalidVerificationToken extends HttpException {
    constructor(message: string) {
        super({ message, errorCode: ErrorCode.INVALID_VERIFICATION_TOKEN }, HttpStatus.UNAUTHORIZED);
    }
}
