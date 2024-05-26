import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDTO, LoginUserResponseDTO, RefreshTokenDTO } from '@nx-angular-nestjs-authentication/models';
import { AuthService } from './auth.service';
import { LocalAuthGuard, RefreshJwtAuthGuard } from './guards';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Passport automatically creates a user object, based on the value we return from the validate() method, and assigns it to the Request object as req.user
  @ApiOperation({ summary: 'Authenticate User and Generate Access Token' })
  // @ApiResponse({ status: 200, description: 'Successful login', type: LoginUserResponseDTO })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request, @Body() _: LoginUserDTO) {
    return await this.authService.verify(request.user);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @ApiOperation({ summary: 'Refresh Access Token' })
  @Post('refresh-token')
  async refresh(@Request() request, @Body() _: RefreshTokenDTO) {
    return await this.authService.refresh(request.body);
  }
}
