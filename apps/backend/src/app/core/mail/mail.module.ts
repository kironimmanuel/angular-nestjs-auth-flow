import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { MailController } from './controller/mail.controller';
import { MailService } from './services/mail.service';

@Module({
    controllers: [MailController],
    providers: [MailService],
    imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class MailModule {}
