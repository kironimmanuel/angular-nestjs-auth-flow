import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterUserDTO, UpdateUserDTO } from '@nx-angular-nestjs-authentication/models';
import { JwtAuthGuard } from '../auth/guards';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/current-user')
  async getUser(@Req() request) {
    const userId = request.user.sub;
    return this.userService.findById(userId);
  }

  @Post('register')
  async createUser(@Body() registerUserDto: RegisterUserDTO) {
    return await this.userService.create(registerUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
