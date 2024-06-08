import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
    controllers: [UserController],
    providers: [UserService, JwtService, MailService],
    imports: [TypeOrmModule.forFeature([UserEntity])],
    exports: [UserService],
})
export class UserModule {}
