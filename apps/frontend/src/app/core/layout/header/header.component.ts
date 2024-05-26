import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { User } from '@nx-angular-nestjs-authentication/models';
import { SessionTimerComponent } from '../../../shared/components/session-timer/session-timer.component';
import { AppRoute } from '../../../shared/enums';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  imports: [CommonModule, MatIcon, MatButtonModule, RouterLink, SessionTimerComponent, MatTooltipModule, MatMenuModule],
  styleUrl: './header.component.css',
  standalone: true,
})
export class HeaderComponent implements OnInit {
  currentUser: User | null;

  homeRoute = AppRoute.HOME;
  loginRoute = AppRoute.LOGIN;
  registerRoute = AppRoute.REGISTER;
  profileRoute = AppRoute.PROFILE;
  newsRoute = AppRoute.NEWS;

  constructor(readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }
}
