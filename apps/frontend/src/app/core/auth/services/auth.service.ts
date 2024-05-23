import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@nx-angular-nestjs-authentication/environments';
import { LoginUserDto, RegisterUserDTO, User, UserResponseDTO } from '@nx-angular-nestjs-authentication/models';
import { catchError } from 'rxjs';
import { AppRoute, AuthType } from '../../../shared/enums';
import { ToastService } from '../../../shared/services/toast.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private registerUrl = `${environment.apiAuthUrl}/${AuthType.REGISTER}`;
  private loginUrl = `${environment.apiAuthUrl}/${AuthType.LOGIN}`;

  currentUser = signal<User | undefined | null>(undefined);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly jwtService: JwtService,
    private readonly toast: ToastService
  ) {
    this.loadCurrentUser();
  }

  getSessionExpirationTime(): number | null {
    return this.jwtService.getTokenExpirationTime();
  }

  private loadCurrentUser(): void {
    const token = this.jwtService.getAccessToken();
    if (token) {
      this.http.get<User>(`${environment.apiUrl}/users/current-user`).subscribe({
        next: (user) => {
          this.currentUser.set(user);
          const expirationTime = this.jwtService.getTokenExpirationTime();
          if (expirationTime) {
            const currentTime = Date.now();
            const remainingTime = expirationTime - currentTime;
            if (remainingTime > 0) {
              this.autoLogout(remainingTime);
            } else {
              this.logout();
            }
          }
        },
        error: () => {
          this.currentUser.set(null);
          this.logout();
        },
      });
    } else {
      this.currentUser.set(null);
    }
  }

  // updateUser(user: User) {
  //   this.http.post<User>(`${environment.apiUrl}/users`, user).subscribe({
  //     next: (users) => this.currentUser.set(users),
  //     error: () => this.currentUser.set(null),
  //   });
  // }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  register(user: RegisterUserDTO) {
    return this.http
      .post(this.registerUrl, user)
      .pipe(
        catchError((error) => {
          this.toast.error({
            title: 'Error',
            content: `Registration failed. Please try again.`,
          });
          throw error;
        })
      )
      .subscribe(() => {
        this.toast.success({
          title: 'Welcome',
          content: `You have registered successfully ${user.username}!`,
        });
        this.login({ email: user.email, password: user.password });
      });
  }

  login(user: LoginUserDto) {
    return this.http.post<UserResponseDTO>(this.loginUrl, user).subscribe((response) => {
      const token = response.accessToken as string;
      const remainingTimeInMs = this.jwtService.getTokenExpirationTimeFromToken(token);
      this.setAuth(response as User);
      this.router.navigate([AppRoute.DASHBOARD]);
      this.autoLogout(remainingTimeInMs - Date.now());
    });
  }

  logout() {
    this.jwtService.destroyToken();
    this.currentUser.set(null);
    this.router.navigate([AppRoute.HOME]);
  }

  autoLogout(timeInMs: number) {
    setTimeout(() => {
      this.logout();
      this.toast.warning({
        title: 'Session Expired',
        content: 'Your session has expired. Please login again.',
      });
    }, timeInMs);
  }

  setAuth(user: User): void {
    this.jwtService.saveToken(user.accessToken, user.refreshToken);
    this.currentUser.set(user);
  }
}
