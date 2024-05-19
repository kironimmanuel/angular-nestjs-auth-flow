import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  imports: [CommonModule, MatIcon, MatButtonModule],
  standalone: true,
})
export class HeaderComponent {
  constructor(readonly authService: AuthService) {}
}
