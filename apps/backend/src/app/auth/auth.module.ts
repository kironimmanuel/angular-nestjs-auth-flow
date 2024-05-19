import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from '../config';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, LocalStrategy, RefreshJwtStrategy } from './strategies';

@Module({
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy, RefreshJwtStrategy],
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule.register(jwtConfig)],
})
export class AuthModule {}
