import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty()
  @MaxLength(30)
  @IsOptional()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsOptional()
  readonly password: string;
}
