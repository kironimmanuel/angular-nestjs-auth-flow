import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({
    type: String,
    description: 'The username of the user',
    maxLength: 30,
  })
  @IsNotEmpty()
  @MaxLength(30)
  @IsOptional()
  readonly username: string;

  @ApiProperty({
    type: String,
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiProperty({
    type: String,
    description: 'The password of the user',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  @IsOptional()
  readonly password?: string;
}
