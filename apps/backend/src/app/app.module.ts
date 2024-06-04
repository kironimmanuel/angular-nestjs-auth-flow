import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ormConfig } from './config';
import { AuthModule } from './core/auth/auth.module';
import { UserEntity } from './core/user/user.entity';
import { UsersModule } from './core/user/user.module';
import { DatabaseSeederService } from './db/database-seeder.service';

@Module({
    // We must use the UserEntity in the TypeOrmModule.forFeature() here for the database seeding
    imports: [TypeOrmModule.forRoot(ormConfig), TypeOrmModule.forFeature([UserEntity]), UsersModule, AuthModule],
    controllers: [AppController],
    providers: [AppService, DatabaseSeederService],
})
export class AppModule {}
