import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { EMPTY } from 'rxjs';
import { appRoutes } from './app.routes';
import { AuthService } from './core/auth/services/auth.service';
import { JwtService } from './core/auth/services/jwt.service';
import { apiInterceptor, errorInterceptor } from './core/interceptors';
import { tokenInterceptor } from './core/interceptors/token.interceptor';

export function initAuth(jwtService: JwtService, authService: AuthService) {
    return () => (jwtService.getAccessTokenFromLocalStorage() ? authService.getCurrentUser() : EMPTY);
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes),
        provideAnimationsAsync(),
        provideHttpClient(withInterceptors([apiInterceptor, tokenInterceptor, errorInterceptor])),
        {
            provide: APP_INITIALIZER,
            useFactory: initAuth,
            deps: [JwtService, AuthService],
            multi: true,
        },
    ],
};
