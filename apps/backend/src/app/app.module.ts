import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ormConfig } from './config';
import { DatabaseSeederService } from './db/database-seeder.service';
import { UserEntity } from './user/user.entity';
import { UsersModule } from './user/user.module';

@Module({
  // We must use the UserEntity in the TypeOrmModule.forFeature() here for the database seeding
  imports: [TypeOrmModule.forRoot(ormConfig), TypeOrmModule.forFeature([UserEntity]), UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, DatabaseSeederService],
})
export class AppModule {}
