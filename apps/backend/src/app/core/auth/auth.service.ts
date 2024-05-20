import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { environment } from '@nx-angular-nestjs-authentication/environments';
import {
  JwtPayloadDTO,
  LoginUserDto,
  RegisterUserDTO,
  UserResponseDTO,
} from '@nx-angular-nestjs-authentication/models';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { UniqueUserValueException } from './exceptions';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: LoginUserDto) {
    const payload: JwtPayloadDTO = { email: user.email, username: user.username };

    const accessToken = this.generateJwtToken(payload);
    const refreshToken = this.generateRefreshJwtToken(payload);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async register(dto: RegisterUserDTO): Promise<UserResponseDTO> {
    const { username, email } = dto;

    const existingUsername = await this.userRepository.findOneBy({ username });
    const existingEmail = await this.userRepository.findOneBy({ email });

    if (existingUsername && existingEmail) {
      throw new UniqueUserValueException('username and email must be unique');
    } else if (existingUsername) {
      throw new UniqueUserValueException('username must be unique');
    } else if (existingEmail) {
      throw new UniqueUserValueException('email must be unique');
    }

    const user = this.userRepository.create(dto);
    await this.userRepository.save(user);
    return this.userService.toUserResponseDTO(user);
  }

  async refresh(user: LoginUserDto) {
    const payload: JwtPayloadDTO = { email: user.email, username: user.username };

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
