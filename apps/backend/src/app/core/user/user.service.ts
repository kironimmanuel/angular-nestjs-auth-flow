import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDTO, UserResponseDTO } from '@nx-angular-nestjs-authentication/models';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository } from 'typeorm';
import { UserNotFoundException } from './exceptions';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService
  ) {}

  findAll(): Promise<UserResponseDTO[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new UserNotFoundException('user not found with id: ' + id);
    }
    return user;
  }

  async findByToken(token: string): Promise<UserResponseDTO> {
    try {
      const decodedToken = await this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      const userEmail = decodedToken.email;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = await this.findByEmail(userEmail);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UserNotFoundException('user not found with email: ' + email);
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    const user = await this.findById(id);
    const updatedUser = { ...user, ...dto };

    if (dto.password) {
      updatedUser.password = await bcrypt.hash(dto.password, 10);
    }

    const savedUser = await this.userRepository.save(updatedUser);
    return this.toUserResponseDTO(savedUser);
  }

  async delete(id: string): Promise<DeleteResult> {
    await this.findById(id);
    return this.userRepository.delete(id);
  }

  public toUserResponseDTO(user: UserEntity): UserResponseDTO {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result as UserResponseDTO;
  }
}
