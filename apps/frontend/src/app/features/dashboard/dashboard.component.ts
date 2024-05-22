import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { UserRole } from '@nx-angular-nestjs-authentication/models';
import { AuthService } from '../../core/auth/services/auth.service';
import { UserService } from '../../shared/services/user.service';

export interface PeriodicElement {
  id: number;
  username: string;
  email: string;
  role: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, username: 'Hydrogen', email: 'hydrogen@example.com', role: UserRole.USER },
  { id: 2, username: 'Helium', email: 'helium@example.com', role: UserRole.USER },
  { id: 3, username: 'Lithium', email: 'lithium@example.com', role: UserRole.USER },
  { id: 4, username: 'Beryllium', email: 'beryllium@example.com', role: UserRole.USER },
  { id: 5, username: 'Boron', email: 'boron@example.com', role: UserRole.USER },
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatListModule, MatTableModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'role'];
  dataSource = ELEMENT_DATA;

  constructor(readonly authService: AuthService, readonly userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers();
  }
}
