import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDTO {
  @ApiProperty({
    type: String,
    description: 'The refresh token of the user',
    required: true,
  })
  @IsNotEmpty()
  readonly refreshToken: string;
}
