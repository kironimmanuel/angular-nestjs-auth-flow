import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt.service';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const accessToken = inject(JwtService).getAccessToken();
  // const refreshToken = inject(JwtService).getRefreshToken();

  request = request.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return next(request);

  // Implement refresh token logic here
};
