import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  LoginUserDto,
  LoginUserResponseDTO,
  RegisterUserDTO,
  RegisterUserResponseDTO,
  User,
  UserResponseDTO,
} from '@nx-angular-nestjs-authentication/models';
import { Observable, catchError, switchMap, tap, throwError } from 'rxjs';
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

  getCurrentUser(): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(ApiEndpoint.CURRENT_USER).pipe(
      tap({
        next: (user) => this.currentUser.set(user as User),
        error: () => this.purgeAuth(),
      })
    );
  }

  // getCurrentUser(): void {
  //   this.http.get<User>(ApiEndpoint.CURRENT_USER).subscribe({
  //     next: (user) => {
  //       this.currentUser.set(user);
  //     },
  //     error: () => {
  //      this.purgeAuth()
  //     },
  //   });
  // }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  register(user: RegisterUserDTO): Observable<RegisterUserResponseDTO> {
    return this.http.post<RegisterUserResponseDTO>(ApiEndpoint.REGISTER, user).pipe(
      tap(() => {
        this.toast.success(successMessage.REGISTRATION);
      }),
      switchMap(() => this.login({ email: user.email, password: user.password })),
      catchError((error) => {
        this.toast.error(errorMessage.GENERIC);
        return throwError(() => error);
      })
    );
  }

  login(user: LoginUserDto): Observable<LoginUserResponseDTO> {
    return this.http.post<LoginUserResponseDTO>(ApiEndpoint.LOGIN, user).pipe(
      tap((response) => {
        this.setAuth(response as User);
      }),
      catchError((error) => {
        if (error.statusCode === 404) {
          this.toast.error(errorMessage.LOGIN_CREDENTIALS);
        }
        return throwError(() => error);
      })
    );
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
