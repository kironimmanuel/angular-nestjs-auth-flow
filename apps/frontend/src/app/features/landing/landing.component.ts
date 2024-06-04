import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { AppRoute } from '../../shared/enums';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit, OnDestroy {
    private isAuthenticatedSubscription?: Subscription;

    constructor(private readonly authService: AuthService, private readonly router: Router) {}
    ngOnInit(): void {
        this.isAuthenticatedSubscription = this.authService.isAuthenticated.subscribe((isAuthenticated) => {
            if (isAuthenticated) {
                this.router.navigate([AppRoute.NEWS]);
            }
        });
    }

    ngOnDestroy(): void {
        this.isAuthenticatedSubscription?.unsubscribe();
    }
}
