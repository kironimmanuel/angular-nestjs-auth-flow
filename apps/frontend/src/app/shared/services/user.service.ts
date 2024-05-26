import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User } from '@nx-angular-nestjs-authentication/models';
import { ApiEndpoint } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users = signal<User[] | undefined | null>(undefined);
  constructor(private readonly http: HttpClient) {}

  getAllUsers() {
    this.http.get<User[]>(ApiEndpoint.USERS).subscribe({
      next: (users) => this.users.set(users),
      error: () => this.users.set(null),
    });
  }
}
