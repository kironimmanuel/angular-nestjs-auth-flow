import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository } from 'typeorm';
import { UpdateUserDTO, UserResponseDTO } from './dto';
import { UserNotFoundException } from './exceptions';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
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
