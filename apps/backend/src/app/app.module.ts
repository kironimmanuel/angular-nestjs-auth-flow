import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ormConfig } from './config';
import { AuthModule } from './core/auth/auth.module';
import { MailModule } from './core/mail/mail.module';
import { UserEntity } from './core/user/entities/user.entity';
import { UserModule } from './core/user/user.module';
import { DatabaseSeederService } from './db/database-seeder.service';

@Module({
    // We must use the UserEntity in the TypeOrmModule.forFeature() here for the database seeding
    imports: [
        TypeOrmModule.forRoot(ormConfig),
        TypeOrmModule.forFeature([UserEntity]),
        UserModule,
        AuthModule,
        MailModule,
    ],
    controllers: [AppController],
    providers: [DatabaseSeederService],
})
export class AppModule {}
