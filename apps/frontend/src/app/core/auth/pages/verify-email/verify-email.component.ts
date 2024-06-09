import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AppRoute } from '../../../../shared/enums';
import { MailService } from '../../services/mail.service';

@Component({
    selector: 'app-verify-email',
    standalone: true,
    imports: [CommonModule, RouterLink, MatButtonModule],
    templateUrl: './verify-email.component.html',
    styleUrl: './verify-email.component.css',
})
export class VerifyEmailComponent implements OnInit {
    isLoading = false;
    loginRoute = AppRoute.LOGIN;

    constructor(private route: ActivatedRoute, private mailService: MailService) {}

    ngOnInit(): void {
        this.verifyUserEmail();
    }

    verifyUserEmail(): void {
        const token = this.route.snapshot.queryParamMap.get('token');
        const email = this.route.snapshot.queryParamMap.get('email');

        if (!token || !email) {
            return;
        }

        this.isLoading = true;

        this.mailService.verifyEmail(token, email).subscribe({
            next: () => (this.isLoading = false),
            error: () => (this.isLoading = false),
        });
    }
}
