import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '@nx-angular-nestjs-authentication/environments';
import { UpdateUserDTO, User } from '@nx-angular-nestjs-authentication/models';
import { AuthService } from '../../core/auth/services/auth.service';
import { ToastService } from './toast.service';

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
    this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe({
      next: (users) => this.users.set(users),
      error: () => this.users.set(null),
    });
  }

  updateUser(user: UpdateUserDTO) {
    this.http.put<UpdateUserDTO>(`${environment.apiUrl}/users/${this.authService.currentUser()?.id}`, user).subscribe({
      next: (user) => this.authService.currentUser.set(user as User),
      error: () =>
        this.toast.error({
          title: 'Something went wrong!',
          content: 'Unable to update user information. Please try again.',
        }),
    });
  }
}
