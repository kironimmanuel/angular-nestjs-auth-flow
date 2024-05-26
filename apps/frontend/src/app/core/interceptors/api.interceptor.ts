import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@nx-angular-nestjs-authentication/environments';

const excludedUrls = ['algolia.com'];

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (excludedUrls.some((url) => req.url.includes(url))) {
    return next(req);
  }

  const apiReq = req.clone({ url: environment.apiUrl + req.url });
  return next(apiReq);
};
