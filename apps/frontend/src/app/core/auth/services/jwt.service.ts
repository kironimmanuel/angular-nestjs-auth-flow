import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JwtService {
  getAccessToken(): string {
    return window.localStorage['accessToken'];
  }

  getRefreshToken(): string {
    return window.localStorage['refreshToken'];
  }

  saveToken(accessToken: string, refreshToken: string): void {
    window.localStorage['accessToken'] = accessToken;
    window.localStorage['refreshToken'] = refreshToken;
  }

  destroyToken(): void {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
  }
}
