import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { JwtService } from '../auth/services/jwt.service';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
    const jwtService = inject(JwtService);
    const authService = inject(AuthService);
    const accessToken = jwtService.getAccessTokenFromLocalStorage();

    if (accessToken) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }

    return next(request).pipe(
        catchError((error) => {
            if (error.statusCode === 401) {
                return jwtService.refreshAccessToken().pipe(
                    switchMap((response: { accessToken: string }) => {
                        jwtService.setAccessTokenToLocalStorage(response.accessToken);
                        request = request.clone({
                            setHeaders: {
                                Authorization: `Bearer ${response.accessToken}`,
                            },
                        });
                        return next(request);
                    }),
                    catchError((refreshError) => {
                        return throwError(() => refreshError);
                    })
                );
            }

            if (error.statusCode === 403) {
                authService.logout();
            }

            return throwError(() => error);
        })
    );
};
