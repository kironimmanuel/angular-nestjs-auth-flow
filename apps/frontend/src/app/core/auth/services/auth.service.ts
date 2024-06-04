import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  CreateUserDTO,
  CreateUserResponseDTO,
  LoginUserDTO,
  LoginUserResponseDTO,
  UpdateUserDTO,
  User,
  UserResponseDTO,
} from '@nx-angular-nestjs-authentication/models';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { ApiEndpoint, AppRoute } from '../../../shared/enums';
import { errorMessage } from '../../../shared/notification/messages';
import { successMessage } from '../../../shared/notification/messages/success.message';
import { ToastService } from '../../../shared/notification/toast/services/toast.service';
import { JwtService } from './jwt.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());
  public isAuthenticated = this.currentUser.pipe(map((user) => !!user));

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly jwtService: JwtService,
    private readonly toast: ToastService,
    private readonly dialog: MatDialog
  ) {}

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser(): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(ApiEndpoint.CURRENT_USER).pipe(
      tap({
        next: (user) => this.currentUserSubject.next(user as User),
        error: () => this.purgeAuth(),
      })
    );
  }

  register(user: CreateUserDTO): Observable<CreateUserResponseDTO> {
    return this.http.post<CreateUserResponseDTO>(ApiEndpoint.REGISTER, user).pipe(
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

  login(user: LoginUserDTO): Observable<LoginUserResponseDTO> {
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

  update(user: UpdateUserDTO): Observable<User> {
    return this.http.put<User>(`${ApiEndpoint.USERS}/${this.currentUserValue?.id}`, user).pipe(
      tap((updatedUser) => {
        this.currentUserSubject.next(updatedUser);
        this.toast.success(successMessage.PROFILE_UPDATE);
      }),
      catchError((error) => {
        this.toast.error(errorMessage.GENERIC);
        return throwError(() => error);
      })
    );
  }

  logout() {
    this.purgeAuth();
    this.dialog.closeAll();
    this.router.navigate([AppRoute.HOME]);
  }

  private setAuth(user: User): void {
    this.jwtService.setAccessTokenToLocalStorage(user.accessToken);
    this.jwtService.setRefreshTokenToLocalStorage(user.refreshToken);
    this.currentUserSubject.next(user);
  }

  private purgeAuth(): void {
    this.jwtService.removeAllTokenFromLocalStorage();
    this.currentUserSubject.next(null);
  }
}
