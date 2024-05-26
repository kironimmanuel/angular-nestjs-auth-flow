import { IsNotEmpty } from 'class-validator';
import { UserRole } from '../enums';

export class JwtPayloadDTO {
  @IsNotEmpty()
  sub: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  role: UserRole;
}
