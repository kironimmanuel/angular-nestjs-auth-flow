import { IsNotEmpty } from 'class-validator';
import { ErrorCode } from '../enums';

export class ErrorDTO {
    @IsNotEmpty()
    readonly statusCode: number;

    @IsNotEmpty()
    readonly statusText: string;

    @IsNotEmpty()
    readonly message: string;

    @IsNotEmpty()
    readonly timestamp: string;

    @IsNotEmpty()
    readonly path: string;

    @IsNotEmpty()
    readonly errorCode: ErrorCode;
}
