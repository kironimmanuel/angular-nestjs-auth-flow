import { Injectable } from '@angular/core';
import { JwtToken } from '@nx-angular-nestjs-authentication/models';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class JwtService {
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  getAccessToken(): string {
    return window.localStorage[this.accessTokenKey];
  }

  getRefreshToken(): string {
    return window.localStorage[this.refreshTokenKey];
  }

  saveToken(accessToken: string, refreshToken: string): void {
    window.localStorage[this.accessTokenKey] = accessToken;
    window.localStorage[this.refreshTokenKey] = refreshToken;
  }

  destroyToken(): void {
    window.localStorage.removeItem(this.accessTokenKey);
    window.localStorage.removeItem(this.refreshTokenKey);
  }

  getTokenExpirationTime(): number | null {
    const token = this.getAccessToken();
    if (!token) return null;
    return this.getTokenExpirationTimeFromToken(token);
  }

  getTokenExpirationTimeFromToken(token: string): number {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken || !decodedToken.exp) {
      return 0;
    }
    return decodedToken.exp * 1000;
  }

  decodeToken(token: string): JwtToken {
    return jwtDecode(token);
  }
}
