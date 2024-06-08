import { ErrorCode } from '@nx-angular-nestjs-authentication/models';

export class ErrorResponse {
    constructor(
        public statusCode: number,
        public statusText: string,
        public message: string,
        public timestamp: string,
        public path: string,
        public errorCode?: ErrorCode
    ) {}
}
