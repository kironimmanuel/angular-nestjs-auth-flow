import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    AccessTokenDTO,
    LoginUserDTO,
    LoginUserResponseDTO,
    RefreshTokenDTO,
} from '@nx-angular-nestjs-authentication/models';
import { AuthService } from './auth.service';
import { LocalAuthGuard, RefreshJwtAuthGuard } from './guards';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // Passport automatically creates a user object, based on the value we return from the validate() method, and assigns it to the Request object as req.user
    @ApiOperation({ summary: 'Authenticate User and Generate Tokens' })
    @ApiResponse({ status: 200, description: 'Successful login', type: LoginUserResponseDTO })
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Request() request, @Body() _: LoginUserDTO) {
        return await this.authService.verifyUser(request.user);
    }

    @ApiOperation({ summary: 'Refresh Access Token' })
    @ApiResponse({ status: 200, description: 'Access Token refreshed', type: AccessTokenDTO })
    @UseGuards(RefreshJwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    async refresh(@Request() request, @Body() _: RefreshTokenDTO) {
        return await this.authService.refreshAccessToken(request.body);
    }
}
