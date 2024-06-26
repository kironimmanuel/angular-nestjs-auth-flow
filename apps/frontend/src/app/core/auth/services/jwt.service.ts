import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorDTO, JwtToken } from '@nx-angular-nestjs-authentication/models';
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

    public getAccessTokenFromLocalStorage(): string {
        return window.localStorage[this.accessTokenKey];
    }

    public getRefreshTokenFromLocalStorage(): string {
        return window.localStorage[this.refreshTokenKey];
    }

    public setAccessTokenToLocalStorage(accessToken: string): void {
        window.localStorage[this.accessTokenKey] = accessToken;
    }

    public setRefreshTokenToLocalStorage(refreshToken: string): void {
        window.localStorage[this.refreshTokenKey] = refreshToken;
    }

    public removeAllTokenFromLocalStorage(): void {
        window.localStorage.removeItem(this.accessTokenKey);
        window.localStorage.removeItem(this.refreshTokenKey);
    }

    public refreshAccessToken(): Observable<{ accessToken: string }> {
        const refreshToken = this.getRefreshTokenFromLocalStorage();

        return this.http
            .post<{ accessToken: string }>(ApiEndpoint.REFRESH_TOKEN, null, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            })
            .pipe(
                map((response) => {
                    this.setAccessTokenToLocalStorage(response.accessToken);
                    return { accessToken: response.accessToken };
                }),
                catchError((error: ErrorDTO) => {
                    this.removeAllTokenFromLocalStorage();
                    return throwError(() => error);
                })
            );
    }

    public getRemainingSessionTime(): number {
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
