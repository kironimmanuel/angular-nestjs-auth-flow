import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { UserRole } from '../enums';

export class UserResponseDTO {
  @ApiProperty({ type: String, description: 'User ID' })
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({ type: String, description: 'Username', maxLength: 30 })
  @IsNotEmpty()
  @MaxLength(30)
  readonly username: string;

  @ApiProperty({ type: String, description: 'Email', format: 'email' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: String, description: 'Role' })
  @IsNotEmpty()
  readonly role: UserRole;

  @ApiProperty({ type: String, description: 'Access Token' })
  @IsNotEmpty()
  readonly accessToken?: string;

  @ApiProperty({ type: String, description: 'Refresh Token' })
  @IsNotEmpty()
  readonly refreshToken?: string;

  @IsNotEmpty()
  readonly password?: string;
}
