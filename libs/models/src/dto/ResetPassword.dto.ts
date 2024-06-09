import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDTO {
    @ApiProperty({ type: String, description: 'Email', required: true })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ type: String, description: 'Password', required: true })
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ type: String, description: 'Reset Password Token', required: true })
    @IsNotEmpty()
    readonly resetPasswordToken: string;
}
