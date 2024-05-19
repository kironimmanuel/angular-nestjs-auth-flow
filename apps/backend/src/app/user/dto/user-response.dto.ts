import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { UserRole } from '../../shared/enums';

export class UserResponseDTO {
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
}
