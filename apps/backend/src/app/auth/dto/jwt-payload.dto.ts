import { IsNotEmpty } from 'class-validator';

export class JwtPayloadDTO {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  username: string;
}
