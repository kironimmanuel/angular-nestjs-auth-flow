import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@nx-angular-nestjs-authentication/models';
import { Repository } from 'typeorm';
import { UserEntity } from '../core/user/user.entity';

@Injectable()
export class DatabaseSeederService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async onModuleInit() {
    const existingUsers = await this.userRepository.count();

    if (existingUsers === 0) {
      await this.seedInitialData();
    }
  }

  async seedInitialData() {
    const users = [
      { username: 'user1', email: 'user1@example.com', password: 'password1', role: UserRole.ADMIN },
      { username: 'user2', email: 'user2@example.com', password: 'password2' },
      { username: 'user3', email: 'user3@example.com', password: 'password3' },
    ];

    for (const userData of users) {
      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);
    }

    console.log('Initial data has been seeded successfully');
  }
}
