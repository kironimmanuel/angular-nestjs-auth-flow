import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    type: String,
    description: 'The username of the user',
    required: true,
    maxLength: 30,
  })
  @IsNotEmpty()
  @MaxLength(30)
  readonly username: string;

  @ApiProperty({
    type: String,
    description: 'The email of the user',
    required: true,
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: String,
    description: 'The password of the user',
    required: true,
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
