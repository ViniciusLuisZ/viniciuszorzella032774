import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // não intercepta login
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const token = auth.accessToken;
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) return throwError(() => err);

      if (err.status !== 401) return throwError(() => err);

      // evita loop
      if (isRefreshing) {
        auth.logout();
        router.navigateByUrl('/login');
        return throwError(() => err);
      }

      isRefreshing = true;

      return auth.refresh().pipe(
        switchMap(() => {
          isRefreshing = false;
          const newToken = auth.accessToken;

          if (!newToken) {
            auth.logout();
            router.navigateByUrl('/login');
            return throwError(() => err);
          }

          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${auth.accessToken}` },
          });

          return next(retryReq);
        }),
        catchError((refreshErr) => {
          isRefreshing = false;
          auth.logout();
          router.navigateByUrl('/login');
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};
