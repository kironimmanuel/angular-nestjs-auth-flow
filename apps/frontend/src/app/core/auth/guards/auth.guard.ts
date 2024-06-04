import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AppRoute } from '../../../shared/enums';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    constructor(private readonly router: Router, private readonly authService: AuthService) {}

    canActivate(): Observable<boolean> {
        return this.authService.isAuthenticated.pipe(
            map((isAuthenticated) => {
                if (!isAuthenticated) {
                    this.router.navigate([AppRoute.HOME]);
                    return false;
                }
                return true;
            })
        );
    }
}
