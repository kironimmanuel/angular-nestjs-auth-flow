import * as bcrypt from 'bcrypt';
import crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '@nx-angular-nestjs-authentication/models';
import { DeleteResult, IsNull, Repository } from 'typeorm';
import { UniqueUserValueException, UserNotFoundException } from '../../../shared/exceptions';
import { MailService } from '../../mail/services/mail.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly mailService: MailService
    ) {}

    async findAll(): Promise<UserResponseDTO[]> {
        return this.userRepository.find();
    }

    async findById(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOneBy({ id: id || IsNull() });
        if (!user) {
            throw new UserNotFoundException('user not found with id: ' + id);
        }
        return user;
    }

    async findByEmail(email: string): Promise<UserEntity> {
        const user = await this.userRepository.findOneBy({ email: email || IsNull() });
        if (!user) {
            throw new UserNotFoundException('user not found with email: ' + email);
        }
        return user;
    }

    async create(dto: CreateUserDTO): Promise<void> {
        const { username, email } = dto;

        const existingUsername = await this.userRepository.findOneBy({ username: username || IsNull() });
        const existingEmail = await this.userRepository.findOneBy({ email: email || IsNull() });

        if (existingUsername && existingEmail) {
            throw new UniqueUserValueException('username and email must be unique');
        } else if (existingUsername) {
            throw new UniqueUserValueException('username must be unique');
        } else if (existingEmail) {
            throw new UniqueUserValueException('email must be unique');
        }

        const verificationToken = crypto.randomBytes(40).toString('hex');
        const userWithVerificationToken = Object.assign(dto, { verificationToken });

        const newUser = this.userRepository.create(userWithVerificationToken);
        await this.userRepository.save(newUser);

        await this.mailService.sendVerificationEmail({ email, username, verificationToken });
    }

    async update(id: string, dto: UpdateUserDTO): Promise<UserResponseDTO> {
        const user = await this.findById(id);
        const updatedUser = { ...user, ...dto };

        if (dto.password) {
            updatedUser.password = await bcrypt.hash(dto.password, 10);
        }

        return await this.userRepository.save(updatedUser);
    }

    async delete(id: string): Promise<DeleteResult> {
        const user = await this.findById(id);
        return this.userRepository.delete(user.id);
    }
}
