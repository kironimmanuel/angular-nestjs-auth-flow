import { IsNotEmpty } from 'class-validator';

export class VerifyEmailDTO {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    verificationToken: string;
}
