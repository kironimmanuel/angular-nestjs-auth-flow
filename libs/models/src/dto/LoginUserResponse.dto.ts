import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserRole } from '../enums';

export class LoginUserResponseDTO {
    @ApiProperty({ type: String, description: 'User ID' })
    @IsNotEmpty()
    readonly id: string;

    @ApiProperty({ type: String, description: 'Username' })
    @IsNotEmpty()
    readonly username: string;

    @ApiProperty({ type: String, description: 'Email' })
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({ type: String, description: 'Role' })
    @IsNotEmpty()
    readonly role: UserRole;

    @ApiProperty({ type: String, description: 'Access Token' })
    @IsNotEmpty()
    readonly accessToken: string;

    @ApiProperty({ type: String, description: 'Refresh Token' })
    @IsNotEmpty()
    readonly refreshToken: string;
}
