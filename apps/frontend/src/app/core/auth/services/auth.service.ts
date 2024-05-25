// import { warningMessage } from './../../../shared/notification/messages/warning.message';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginUserDto, RegisterUserDTO, User, UserResponseDTO } from '@nx-angular-nestjs-authentication/models';
import { catchError } from 'rxjs';
import { ApiEndpoint, AppRoute } from '../../../shared/enums';
import { errorMessage } from '../../../shared/notification/messages';
import { successMessage } from '../../../shared/notification/messages/success.message';
import { ToastService } from '../../../shared/notification/toast/services/toast.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser = signal<User | undefined | null>(undefined);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly jwtService: JwtService,
    private readonly toast: ToastService,
    private readonly dialog: MatDialog
  ) {}

  getCurrentUser(): void {
    this.http.get<User>(ApiEndpoint.CURRENT_USER).subscribe({
      next: (user) => {
        this.currentUser.set(user);
      },
      error: () => {
        this.currentUser.set(null);
        this.logout();
      },
    });
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  register(user: RegisterUserDTO) {
    return this.http
      .post(ApiEndpoint.REGISTER, user)
      .pipe(
        catchError((error) => {
          this.toast.error(errorMessage.GENERIC);
          throw error;
        })
      )
      .subscribe(() => {
        this.toast.success(successMessage.REGISTRATION);
        this.login({ email: user.email, password: user.password });
      });
  }

  login(user: LoginUserDto) {
    return this.http.post<UserResponseDTO>(ApiEndpoint.LOGIN, user).subscribe((response) => {
      this.setAuth(response as User);
      this.router.navigate([AppRoute.DASHBOARD]);
    });
  }

  logout() {
    this.purgeAuth();
    this.dialog.closeAll();
    this.router.navigate([AppRoute.HOME]);
  }

  setAuth(user: User): void {
    this.jwtService.setAccessTokenToLocalStorage(user.accessToken);
    this.jwtService.setRefreshTokenToLocalStorage(user.refreshToken);
    this.currentUser.set(user);
  }

  purgeAuth(): void {
    this.jwtService.removeAllTokenFromLocalStorage();
    this.currentUser.set(null);
  }
}
