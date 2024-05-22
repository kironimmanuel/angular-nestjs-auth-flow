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
      { username: 'admin', email: 'admin@gmail.com', password: 'password', role: UserRole.ADMIN },
      { username: 'user', email: 'user@gmail.com', password: 'password' },
    ];

    for (const userData of users) {
      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);
    }

    console.log('Initial data has been seeded successfully');
  }
}
