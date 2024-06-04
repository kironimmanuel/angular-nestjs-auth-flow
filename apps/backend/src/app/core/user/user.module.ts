import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
    controllers: [UserController],
    providers: [UserService, JwtService],
    imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
