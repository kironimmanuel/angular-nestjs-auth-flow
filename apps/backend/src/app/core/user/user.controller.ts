import { Body, Controller, Delete, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { UpdateUserDTO } from '@nx-angular-nestjs-authentication/models';
import { JwtAuthGuard } from '../auth/guards';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get('/current-user')
  getUser(@Req() request) {
    const token = request.headers.authorization.split(' ')[1];

    if (!token) {
      return null;
    }

    return this.userService.findByToken(token);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
