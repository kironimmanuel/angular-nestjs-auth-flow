import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { RegisterUserDTO } from '@nx-angular-nestjs-authentication/models';
import { AuthService } from './auth.service';
import { LocalAuthGuard, RefreshJwtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDTO) {
    return await this.authService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request) {
    return await this.authService.login(request.user);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() request) {
    return await this.authService.refresh(request.body);
  }
}
