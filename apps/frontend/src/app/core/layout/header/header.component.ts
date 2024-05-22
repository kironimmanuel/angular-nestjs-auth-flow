import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { SessionTimerComponent } from '../../../shared/components/session-timer/session-timer.component';
import { AppRoute } from '../../../shared/enums';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  imports: [CommonModule, MatIcon, MatButtonModule, RouterLink, SessionTimerComponent, MatTooltipModule],
  styleUrl: './header.component.css',
  standalone: true,
})
export class HeaderComponent {
  landingRoute = AppRoute.LANDING;
  loginRoute = AppRoute.LOGIN;
  registerRoute = AppRoute.REGISTER;

  constructor(readonly authService: AuthService) {}
}
