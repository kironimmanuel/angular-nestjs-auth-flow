import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
    controllers: [MailController],
    providers: [MailService],
    imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class MailModule {}
