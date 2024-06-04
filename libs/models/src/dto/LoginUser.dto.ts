import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserRole } from '../enums';

export class LoginUserDTO {
    @ApiProperty({ type: String, description: 'Email', required: true })
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({ type: String, description: 'Password', required: true })
    @IsNotEmpty()
    readonly password: string;

    readonly id?: string;
    readonly username?: string;
    readonly role?: UserRole;
}
