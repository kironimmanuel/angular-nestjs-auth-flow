import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from '../mail/services/mail.service';
import { UserController } from './controller/user.controller';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
    controllers: [UserController],
    providers: [UserService, JwtService, MailService],
    imports: [TypeOrmModule.forFeature([UserEntity])],
    exports: [UserService],
})
export class UserModule {}
