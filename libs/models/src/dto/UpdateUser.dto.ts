import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDTO {
    @ApiProperty({ type: String, description: 'Username', maxLength: 30, required: false })
    @IsNotEmpty()
    @MaxLength(30)
    @IsOptional()
    readonly username: string;

    @ApiProperty({ type: String, description: 'Email', format: 'email', required: false })
    @IsNotEmpty()
    @IsEmail()
    @IsOptional()
    readonly email: string;

    @ApiProperty({ type: String, description: 'Password', minLength: 8, required: false })
    @IsNotEmpty()
    @MinLength(8)
    @IsOptional()
    readonly password?: string;
}
