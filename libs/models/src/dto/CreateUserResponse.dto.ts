import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserRole } from '../enums';

export class CreateUserResponseDTO {
  @ApiProperty({ type: String, description: 'User ID' })
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({ type: String, description: 'Username' })
  @IsNotEmpty()
  readonly username?: string;

  @ApiProperty({ type: String, description: 'Email' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ type: String, description: 'Role' })
  @IsNotEmpty()
  readonly role: UserRole;
}
