import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
// import { catchError, switchMap, throwError } from 'rxjs';
import { JwtService } from '../auth/services/jwt.service';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const accessToken = inject(JwtService).getAccessTokenFromLocalStorage();
  // const refreshToken = inject(JwtService).getRefreshTokenFromLocalStorage();

  request = request.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return next(request);

  // Implement refresh token logic here
  // return next(request).pipe(
  //   catchError((error) => {
  //     if (error.status === 401 && refreshToken) {
  //       console.log('👍👍👍👍👍');
  //       return inject(JwtService)
  //         .refreshAccessToken()
  //         .pipe(
  //           switchMap(() => {
  //             request = request.clone({
  //               setHeaders: {
  //                 Authorization: `Bearer ${inject(JwtService).getAccessTokenFromLocalStorage()}`,
  //               },
  //             });
  //             return next(request);
  //           })
  //         );
  //     }
  //     return throwError(error);
  //   })
  // );
};
