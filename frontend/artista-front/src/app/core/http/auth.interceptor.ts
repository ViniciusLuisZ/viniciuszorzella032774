import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, Subject, take } from 'rxjs';

let isRefreshing = false;
const refreshed$ = new Subject<void>();

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // não intercepta auth
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
      if (err.status !== 401 && err.status !== 403) return throwError(() => err);

      // se refresh expirou, acabou: volta pro login
      if (auth.isRefreshExpired()) {
        auth.logout();
        router.navigateByUrl('/login');
        return throwError(() => err);
      }

      // se já tem refresh em andamento, espera e tenta de novo
      if (isRefreshing) {
        return refreshed$.pipe(
          take(1),
          switchMap(() => {
            const newToken = auth.accessToken;
            if (!newToken) {
              auth.logout();
              router.navigateByUrl('/login');
              return throwError(() => err);
            }
            const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
            return next(retryReq);
          }),
        );
      }

      isRefreshing = true;

      return auth.refresh().pipe(
        switchMap(() => {
          isRefreshing = false;
          refreshed$.next();

          const newToken = auth.accessToken;
          if (!newToken) {
            auth.logout();
            router.navigateByUrl('/login');
            return throwError(() => err);
          }

          const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
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
