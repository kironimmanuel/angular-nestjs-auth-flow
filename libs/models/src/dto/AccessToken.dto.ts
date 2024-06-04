import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AccessTokenDTO {
    @ApiProperty({ type: String, description: 'Access Token', required: true })
    @IsNotEmpty()
    readonly accessToken: string;
}
