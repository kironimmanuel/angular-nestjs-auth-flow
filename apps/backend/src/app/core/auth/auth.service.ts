import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { environment } from '@nx-angular-nestjs-authentication/environments';
import {
  JwtPayloadDTO,
  LoginUserDTO,
  LoginUserResponseDTO,
  UserResponseDTO,
} from '@nx-angular-nestjs-authentication/models';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JwtPayloadFactory } from './utils/jwt-payload.factory';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _: Repository<UserEntity>,
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<UserResponseDTO> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async verifyUser(user: LoginUserDTO): Promise<LoginUserResponseDTO> {
    const payload: JwtPayloadDTO = JwtPayloadFactory.create(user);

    const accessToken = this.generateJwtToken(payload);
    const refreshToken = this.generateRefreshJwtToken(payload);

    return Object.assign(user, { accessToken, refreshToken }) as LoginUserResponseDTO;
  }

  async refreshAccessToken(user: LoginUserDTO): Promise<{ accessToken: string }> {
    const payload: JwtPayloadDTO = JwtPayloadFactory.create(user);

    const accessToken = this.generateJwtToken(payload);

    return { accessToken };
  }

  private generateJwtToken(payload: JwtPayloadDTO) {
    return this.jwtService.sign(payload);
  }

  private generateRefreshJwtToken(payload: JwtPayloadDTO) {
    return this.jwtService.sign(payload, { expiresIn: environment.refreshTokenLifetime });
  }
}
