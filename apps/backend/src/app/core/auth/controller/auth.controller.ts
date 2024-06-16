import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Headers,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UnauthorizedException,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    AccessTokenDTO,
    LoginUserDTO,
    LoginUserResponseDTO,
    RefreshTokenDTO,
    ResetPasswordDTO,
    VerifyEmailDTO,
} from '@nx-angular-nestjs-authentication/models';
import { GetCurrentUserId } from '../../../shared/decorators';
import { LocalAuthGuard, RefreshJwtAuthGuard } from '../guards';
import { AuthService } from '../services/auth.service';

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
        return await this.authService.login(request.user);
    }

    @ApiOperation({ summary: 'Verify Email' })
    @ApiResponse({ status: 200, description: 'Email verified' })
    @HttpCode(HttpStatus.OK)
    @Post('verify-email')
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDTO) {
        return await this.authService.verifyEmail(verifyEmailDto);
    }

    @ApiOperation({ summary: 'Refresh Access Token' })
    @ApiResponse({ status: 200, description: 'Access Token refreshed', type: AccessTokenDTO })
    @UseGuards(RefreshJwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    async refresh(@GetCurrentUserId() userId: string) {
        return await this.authService.refreshAccessToken(userId);
    }

    @ApiOperation({ summary: 'Forgot Password' })
    @HttpCode(HttpStatus.OK)
    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return await this.authService.forgotPassword(email);
    }

    @ApiOperation({ summary: 'Reset Password' })
    @HttpCode(HttpStatus.OK)
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDTO) {
        return await this.authService.resetPassword(resetPasswordDto);
    }
}
