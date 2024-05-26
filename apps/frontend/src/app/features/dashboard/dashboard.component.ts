import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { User } from '@nx-angular-nestjs-authentication/models';
import { AuthService } from '../../core/auth/services/auth.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatListModule, MatTableModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  currentUser: User | null;

  displayedColumns: string[] = ['id', 'username', 'email', 'role'];

  constructor(readonly authService: AuthService, readonly userService: UserService) {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.userService.getAllUsers();
  }
}
