import { Route } from '@angular/router';
import { AuthGuard } from './core/auth/services/auth-guard.service';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./core/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./core/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'privacy',
    loadComponent: () => import('./core/privacy/privacy.component').then((m) => m.PrivacyComponent),
  },
  {
    path: 'terms-of-service',
    loadComponent: () => import('./core/terms/terms.component').then((m) => m.TermsComponent),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
];
