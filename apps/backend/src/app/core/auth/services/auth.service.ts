import * as bcrypt from 'bcrypt';
import crypto from 'crypto';

import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { environment } from '@nx-angular-nestjs-authentication/environments';
import {
    JwtPayloadDTO,
    LoginUserDTO,
    LoginUserResponseDTO,
    VerifyEmailDTO,
} from '@nx-angular-nestjs-authentication/models';
import { IsNull, Repository } from 'typeorm';
import {
    EmailNotVerifiedException,
    InvalidCredentialsException,
    InvalidVerificationToken,
} from '../../../shared/exceptions';
import { MailService } from '../../mail/services/mail.service';
import { UserEntity } from '../../user/entities/user.entity';
import { JwtPayloadFactory } from '../models/JwtPayloadFactory';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly mailService: MailService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<UserEntity> {
        const user = await this.userRepository.findOneBy({ email: email || IsNull() });

        if (!user) {
            throw new InvalidCredentialsException('invalid credentials');
        }

        if (user && !(await bcrypt.compare(password, user.password))) {
            throw new InvalidCredentialsException('invalid credentials');
        }

        if (!user.isVerified) {
            throw new EmailNotVerifiedException('email not verified');
        }

        return user;
    }

    async verifyEmail({ verificationToken, email }: VerifyEmailDTO): Promise<void> {
        const user = await this.userRepository.findOneBy({ email: email || IsNull() });

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

    async forgotPassword(email: string): Promise<void> {
        const user = await this.userRepository.findOneBy({ email: email || IsNull() });

        if (!user) {
            throw new InvalidCredentialsException('please provide a valid email address');
        }

        const resetPasswordToken = crypto.randomBytes(70).toString('hex');
        const resetPasswordTokenExpirationDate = new Date(Date.now() + environment.resetPasswordTokenLifetime);

        await this.mailService.sendPasswordResetEmail({
            email: user.email,
            username: user.username,
            passwordResetToken: resetPasswordToken,
        });

        const hashedPasswordToken = await bcrypt.hash(resetPasswordToken, 10);

        const updatedUser = Object.assign(user, {
            resetPasswordToken: hashedPasswordToken,
            resetPasswordTokenExpirationDate,
        });

        await this.userRepository.save(updatedUser);
    }

    async resetPassword({
        email,
        password,
        resetPasswordToken,
    }: {
        email: string;
        resetPasswordToken: string;
        password: string;
    }): Promise<void> {
        const user = await this.userRepository.findOneBy({ email: email || IsNull() });
        if (!user) {
            throw new InvalidCredentialsException('please provide a valid email address');
        }

        if (!(await bcrypt.compare(resetPasswordToken, user.resetPasswordToken))) {
            throw new InvalidVerificationToken('invalid password reset token');
        }

        const updatedUser = Object.assign(user, {
            password: await bcrypt.hash(password, 10),
            resetPasswordToken: null,
            resetPasswordTokenExpirationDate: null,
        });

        await this.userRepository.save(updatedUser);
    }

    async refreshAccessToken(userId: string): Promise<{ accessToken: string }> {
        const user = await this.userRepository.findOneBy({ id: userId || IsNull() });

        if (!user) {
            throw new ForbiddenException('Access Denied');
        }

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
