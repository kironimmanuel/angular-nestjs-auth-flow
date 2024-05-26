import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateUserDTO,
  CreateUserResponseDTO,
  UpdateUserDTO,
  UserResponseDTO,
} from '@nx-angular-nestjs-authentication/models';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository } from 'typeorm';
import { UniqueUserValueException, UserNotFoundException } from './exceptions';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findAll(): Promise<UserResponseDTO[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new UserNotFoundException('user not found with id: ' + id);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UserNotFoundException('user not found with email: ' + email);
    }
    return user;
  }

  async create(dto: CreateUserDTO): Promise<CreateUserResponseDTO> {
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
    return await this.userRepository.save(user);
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
