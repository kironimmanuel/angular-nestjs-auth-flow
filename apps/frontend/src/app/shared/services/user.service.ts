import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '@nx-angular-nestjs-authentication/models';
import { AuthService } from '../../core/auth/services/auth.service';
import { ApiEndpoint } from '../enums';
import { ToastService } from '../notification/toast/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users = signal<User[] | undefined | null>(undefined);
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly toast: ToastService
  ) {}

  getAllUsers() {
    this.http.get<User[]>(ApiEndpoint.USERS).subscribe({
      next: (users) => this.users.set(users),
      error: () => this.users.set(null),
    });
  }
}
