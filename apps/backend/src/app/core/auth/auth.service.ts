import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { environment } from '@nx-angular-nestjs-authentication/environments';
import {
    JwtPayloadDTO,
    LoginUserDTO,
    LoginUserResponseDTO,
    VerifyEmailDTO,
} from '@nx-angular-nestjs-authentication/models';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import {
    EmailNotVerifiedException,
    InvalidCredentialsException,
    InvalidVerificationToken,
} from '../../shared/exceptions';
import { UserEntity } from '../user/user.entity';
import { JwtPayloadFactory } from './utils/jwt-payload.factory';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<UserEntity> {
        const user = await this.userRepository.findOneBy({ email });

        if (!user) {
            throw new InvalidCredentialsException('invalid credentials');
        }

        if (!user.isVerified) {
            throw new EmailNotVerifiedException('email not verified');
        }

        if (user && !(await bcrypt.compare(password, user.password))) {
            throw new InvalidCredentialsException('invalid credentials');
        }

        return user;
    }

    async verifyEmail({ verificationToken, email }: VerifyEmailDTO): Promise<void> {
        const user = await this.userRepository.findOneBy({ email });

        if (!user) {
            throw new InvalidCredentialsException('invalid credentials');
        }

        if (user.verificationToken !== verificationToken) {
            throw new InvalidVerificationToken('invalid verification token');
        }

        const verifiedUser = Object.assign(user, { isVerified: true, verifiedAt: new Date(), verificationToken: null });

        await this.userRepository.save(verifiedUser);
    }

    async login(user: LoginUserDTO): Promise<LoginUserResponseDTO> {
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
