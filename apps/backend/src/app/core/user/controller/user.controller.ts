import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '@nx-angular-nestjs-authentication/models';
import { JwtAuthGuard } from '../../auth/guards';
import { UserService } from '../services/user.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Users')
@Controller()
export class UserController {
    constructor(private userService: UserService) {}

    @ApiOperation({ summary: 'Get all Users' })
    @ApiResponse({ status: 200, description: 'All Users', type: UserResponseDTO, isArray: true })
    // @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('users')
    async getUsers() {
        return this.userService.findAll();
    }

    @ApiOperation({ summary: 'Get current User' })
    @ApiResponse({ status: 200, description: 'Current User', type: UserResponseDTO })
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('users/current-user')
    async getUser(@Req() request) {
        const userId = request.user.sub;
        return this.userService.findById(userId);
    }

    @ApiOperation({ summary: 'Create a User' })
    @ApiResponse({ status: 201, description: 'User created' })
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async createUser(@Body() createUserDto: CreateUserDTO) {
        return await this.userService.create(createUserDto);
    }

    @ApiOperation({ summary: 'Update a User' })
    @ApiResponse({ status: 200, description: 'User updated', type: UpdateUserDTO })
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Put('users/:id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO) {
        return this.userService.update(id, updateUserDto);
    }

    @ApiOperation({ summary: 'Delete a User' })
    @ApiResponse({ status: 204, description: 'User deleted' })
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('users/:id')
    async deleteUser(@Param('id') id: string) {
        return this.userService.delete(id);
    }
}
