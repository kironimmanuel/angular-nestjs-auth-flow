import { Route } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';

export const appRoutes: Route[] = [
    {
        path: '',
        loadComponent: () => import('./features/landing/landing.component').then((m) => m.LandingComponent),
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
        path: 'verify-email',
        loadComponent: () =>
            import('./core/auth/pages/verify-email/verify-email.component').then((m) => m.VerifyEmailComponent),
    },
    {
        path: 'privacy',
        loadComponent: () => import('./features/privacy/privacy.component').then((m) => m.PrivacyComponent),
    },
    {
        path: 'terms-of-service',
        loadComponent: () => import('./features/terms/terms.component').then((m) => m.TermsComponent),
    },
    {
        path: 'news',
        canActivate: [AuthGuard],
        loadComponent: () => import('./features/news/news.component').then((m) => m.NewsComponent),
    },
    {
        path: 'profile',
        canActivate: [AuthGuard],
        loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent),
    },
    {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    },
];
