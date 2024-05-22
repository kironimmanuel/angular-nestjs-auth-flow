import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AppRoute } from '../../../shared/enums';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  imports: [CommonModule, MatIcon, MatButtonModule, RouterLink],
  standalone: true,
})
export class HeaderComponent {
  landingRoute = AppRoute.LANDING;
  loginRoute = AppRoute.LOGIN;
  registerRoute = AppRoute.REGISTER;

  constructor(readonly authService: AuthService) {}
}
