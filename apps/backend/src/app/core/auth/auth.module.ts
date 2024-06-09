import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from '../../config';
import { MailService } from '../mail/services/mail.service';
import { UserEntity } from '../user/entities/user.entity';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy, LocalStrategy, RefreshJwtStrategy } from './strategies';

@Module({
    controllers: [AuthController],
    providers: [AuthService, MailService, LocalStrategy, JwtStrategy, RefreshJwtStrategy],
    imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule.register(jwtConfig)],
})
export class AuthModule {}
