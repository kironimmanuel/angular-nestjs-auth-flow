import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AppRoute } from '../../shared/enums';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  homeRoute = AppRoute.HOME;
}
