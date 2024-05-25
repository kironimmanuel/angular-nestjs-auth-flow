import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtToken } from '@nx-angular-nestjs-authentication/models';
import { jwtDecode } from 'jwt-decode';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ApiEndpoint } from '../../../shared/enums';
import { errorMessage } from '../../../shared/notification/messages';
import { ToastService } from '../../../shared/notification/toast/services/toast.service';

@Injectable({ providedIn: 'root' })
export class JwtService {
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  constructor(private http: HttpClient, private toast: ToastService) {}

  getAccessTokenFromLocalStorage(): string {
    return window.localStorage[this.accessTokenKey];
  }

  getRefreshTokenFromLocalStorage(): string {
    return window.localStorage[this.refreshTokenKey];
  }

  setAccessTokenToLocalStorage(accessToken: string): void {
    window.localStorage[this.accessTokenKey] = accessToken;
  }

  setRefreshTokenToLocalStorage(refreshToken: string): void {
    window.localStorage[this.refreshTokenKey] = refreshToken;
  }

  removeAllTokenFromLocalStorage(): void {
    window.localStorage.removeItem(this.accessTokenKey);
    window.localStorage.removeItem(this.refreshTokenKey);
  }

  refreshAccessToken(): Observable<{ accessToken: string }> {
    const refreshToken = this.getRefreshTokenFromLocalStorage();
    if (!refreshToken) {
      this.toast.error(errorMessage.UNAUTHORIZED);
      return throwError(() => new Error(errorMessage.UNAUTHORIZED.title));
    }

    return this.http.post<{ accessToken: string }>(ApiEndpoint.REFRESH_TOKEN, { refreshToken }).pipe(
      map((response) => {
        this.setAccessTokenToLocalStorage(response.accessToken);
        return { accessToken: response.accessToken };
      }),
      catchError((error) => {
        this.removeAllTokenFromLocalStorage();
        return throwError(() => new Error(error));
      })
    );
  }

  getRemainingSessionTime(): number {
    const expirationTime = this.getTokenExpirationTime();
    return expirationTime ? expirationTime - Date.now() : 0;
  }

  private getTokenExpirationTime(): number {
    const token = this.getAccessTokenFromLocalStorage();
    if (!token) return 0;

    const decodedToken = this.decodeToken(token);
    if (!decodedToken || !decodedToken.exp) {
      return 0;
    }

    return decodedToken.exp * 1000;
  }

  private decodeToken(token: string): JwtToken {
    return jwtDecode(token);
  }
}
