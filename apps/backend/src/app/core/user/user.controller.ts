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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO, UpdateUserDTO } from '@nx-angular-nestjs-authentication/models';
import { JwtAuthGuard } from '../auth/guards';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Users')
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get all Users' })
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get current User' })
  @UseGuards(JwtAuthGuard)
  @Get('users/current-user')
  async getUser(@Req() request) {
    const userId = request.user.sub;
    return this.userService.findById(userId);
  }

  @ApiOperation({ summary: 'Register a new User' })
  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDTO) {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Update a User' })
  @UseGuards(JwtAuthGuard)
  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a User' })
  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
