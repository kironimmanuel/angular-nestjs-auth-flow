import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { UserRole } from '../enums';

export class UserResponseDTO {
  @IsNotEmpty()
  readonly id: string;

  @IsNotEmpty()
  @MaxLength(30)
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password?: string;

  @IsNotEmpty()
  readonly role: UserRole;

  @IsNotEmpty()
  readonly accessToken?: string;

  @IsNotEmpty()
  readonly refreshToken?: string;
}
