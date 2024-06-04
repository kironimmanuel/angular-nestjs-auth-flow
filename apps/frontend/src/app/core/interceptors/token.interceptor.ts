import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { JwtService } from '../auth/services/jwt.service';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
    const jwtService = inject(JwtService);
    const accessToken = jwtService.getAccessTokenFromLocalStorage();
    const refreshToken = jwtService.getRefreshTokenFromLocalStorage();

    request = request.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return next(request).pipe(
        catchError((error) => {
            if (error.statusCode === 401 && refreshToken) {
                return jwtService.refreshAccessToken().pipe(
                    switchMap((response: { accessToken: string }) => {
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
            return throwError(() => error);
        })
    );
};
