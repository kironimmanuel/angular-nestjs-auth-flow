import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AppRoute } from '../../../shared/enums';
import { ToastService } from '../../../shared/services/toast.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    private readonly router: Router,
    private readonly jwtService: JwtService,
    private readonly toast: ToastService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.jwtService.getAccessToken()) {
      return true;
    } else {
      this.router.navigate([AppRoute.HOME]);
      this.toast.error({
        title: 'Unauthorized access',
        content: 'You need to login to access this page',
      });
      return false;
    }
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthGuardService).canActivate(next, state);
};
