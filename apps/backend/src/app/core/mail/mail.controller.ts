import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MailService } from './mail.service';

@Controller()
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @ApiOperation({ summary: 'Resend Verification Email' })
    @ApiResponse({ status: 200, description: 'Email verification sent' })
    @HttpCode(HttpStatus.OK)
    @Post('/resend-verification-email')
    async verifyEmail(@Body('email') email: string) {
        return await this.mailService.resendVerificationEmail(email);
    }
}
