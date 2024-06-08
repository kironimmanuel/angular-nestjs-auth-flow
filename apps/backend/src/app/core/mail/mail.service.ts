import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs-extra';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { Repository } from 'typeorm';
import { nodemailerConfig } from '../../config/nodemailer.config';
import { UserNotFoundException } from '../../shared/exceptions';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {
        const { ORIGIN, SENDER_EMAIL, SENDER_NAME } = process.env;

        this.transporter = nodemailer.createTransport(nodemailerConfig);
        this.senderEmail = SENDER_EMAIL;
        this.senderName = SENDER_NAME;
        this.origin = ORIGIN;
    }

    private senderEmail: string;
    private senderName: string;
    private origin: string;

    async sendVerificationEmail({
        email,
        username,
        verificationToken,
    }: {
        username: string;
        email: string;
        verificationToken: string;
    }): Promise<nodemailer.SentMessageInfo> {
        const templatePath = path.join(__dirname, 'assets/email-verification.template.html');
        let emailHtml = await fs.readFile(templatePath, 'utf8');

        emailHtml = emailHtml.replace('{{origin}}', this.origin);
        emailHtml = emailHtml.replace('{{username}}', username);
        emailHtml = emailHtml.replace('{{email}}', email);
        emailHtml = emailHtml.replace('{{verificationToken}}', verificationToken);

        try {
            const info = await this.transporter.sendMail({
                from: `"${this.senderName}" <${this.senderEmail}>`,
                to: email,
                subject: 'Email Verification',
                html: emailHtml,
            });
            return info;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async resendVerificationEmail(email: string): Promise<void> {
        const user = await this.userRepository.findOneBy({ email });

        if (!user) {
            throw new UserNotFoundException('user not found');
        }

        await this.sendVerificationEmail({
            email: user.email,
            username: user.username,
            verificationToken: user.verificationToken,
        });
    }
}
