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
    error = false;
    loading = false;
    loginRoute = AppRoute.LOGIN;

    constructor(private route: ActivatedRoute, private mailService: MailService) {}

    ngOnInit(): void {
        this.verifyUserEmail();
    }

    verifyUserEmail(): void {
        this.loading = true;
        const token = this.route.snapshot.queryParamMap.get('token');
        const email = this.route.snapshot.queryParamMap.get('email');

        if (!token || !email) {
            this.error = true;
            this.loading = false;
            return;
        }

        this.mailService.verifyEmail(token, email).subscribe({
            next: () => {
                this.loading = false;
            },
            error: () => {
                this.error = true;
                this.loading = false;
            },
        });
    }
}
