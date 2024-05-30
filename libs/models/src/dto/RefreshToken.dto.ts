import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDTO {
  @ApiProperty({ type: String, description: 'Refresh Token', required: true })
  @IsNotEmpty()
  readonly refreshToken: string;
}
