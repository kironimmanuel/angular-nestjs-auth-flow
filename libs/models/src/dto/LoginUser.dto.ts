import { IsNotEmpty } from 'class-validator';
import { UserRole } from '../enums';

export class LoginUserDto {
  @IsNotEmpty()
  readonly id?: string;

  @IsNotEmpty()
  readonly username?: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly role?: UserRole;
}
