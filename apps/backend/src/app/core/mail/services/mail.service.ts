import * as fs from 'fs-extra';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { nodemailerConfig } from '../../../config/nodemailer.config';
import { UserNotFoundException } from '../../../shared/exceptions';
import { UserEntity } from '../../user/entities/user.entity';
import { MailOptions } from '../models/MailOptions';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    private origin: string;

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {
        this.transporter = nodemailer.createTransport(nodemailerConfig);
        this.origin = process.env.ORIGIN;
    }

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
            const mailOptions = new MailOptions(email, 'Email Verification', emailHtml);
            const info = await this.transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async resendVerificationEmail(email: string): Promise<void> {
        const user = await this.userRepository.findOneBy({ email: email || IsNull() });

        if (!user) {
            throw new UserNotFoundException('user not found');
        }

        await this.sendVerificationEmail({
            email: user.email,
            username: user.username,
            verificationToken: user.verificationToken,
        });
    }

    async sendPasswordResetEmail({
        email,
        username,
        passwordResetToken,
    }: {
        username: string;
        email: string;
        passwordResetToken: string;
    }): Promise<nodemailer.SentMessageInfo> {
        const templatePath = path.join(__dirname, 'assets/password-reset.template.html');
        let emailHtml = await fs.readFile(templatePath, 'utf8');

        emailHtml = emailHtml.replace('{{origin}}', this.origin);
        emailHtml = emailHtml.replace('{{username}}', username);
        emailHtml = emailHtml.replace('{{email}}', email);
        emailHtml = emailHtml.replace('{{passwordResetToken}}', passwordResetToken);

        try {
            const mailOptions = new MailOptions(email, 'Password Reset', emailHtml);
            const info = await this.transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
