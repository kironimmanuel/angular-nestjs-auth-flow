import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AppRoute } from '../../../shared/enums';
import { errorMessage } from '../../../shared/notification/messages';
import { ToastService } from '../../../shared/notification/toast/services/toast.service';
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
    if (this.jwtService.getAccessTokenFromLocalStorage()) {
      return true;
    } else {
      this.router.navigate([AppRoute.HOME]);
      this.toast.error(errorMessage.UNAUTHORIZED);
      return false;
    }
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(AuthGuardService).canActivate(next, state);
};
