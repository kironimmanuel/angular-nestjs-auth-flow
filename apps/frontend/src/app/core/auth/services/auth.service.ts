import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@nx-angular-nestjs-authentication/environments';
import { LoginUserDto, RegisterUserDTO, User, UserResponseDTO } from '@nx-angular-nestjs-authentication/models';
import { AuthType } from '../../../shared/enums/AuthType.enum';
import { JwtService } from './jwt.service';

@Injectable({
  // It will be available in the root injector, which means that it will be a singleton instance and will be available throughout the application.
  providedIn: 'root',
})
export class AuthService {
  private registerUrl = `${environment.apiAuthUrl}/${AuthType.REGISTER}`;
  private loginUrl = `${environment.apiAuthUrl}/${AuthType.LOGIN}`;

  currentUser = signal<User | undefined | null>(undefined);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly jwtService: JwtService
  ) {}

  register(user: RegisterUserDTO) {
    return this.http.post(this.registerUrl, user).subscribe(() => {
      this.login({ email: user.email, password: user.password });
    });
  }

  login(user: LoginUserDto) {
    return this.http.post<UserResponseDTO>(this.loginUrl, user).subscribe((response) => {
      this.setAuth(response as User);
      this.router.navigate(['/']);
    });
  }

  logout() {
    this.jwtService.destroyToken();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  setAuth(user: User): void {
    this.jwtService.saveToken(user.accessToken, user.refreshToken);
    this.currentUser.set(user);
  }
}
