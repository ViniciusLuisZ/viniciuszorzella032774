import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { AuthApi } from './auth.api';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS = 'access_token';
  private readonly REFRESH = 'refresh_token';

  private readonly state$ = new BehaviorSubject<AuthState>({
    accessToken: localStorage.getItem(this.ACCESS),
    refreshToken: localStorage.getItem(this.REFRESH),
  });

  constructor(private api: AuthApi) {}

  get accessToken(): string | null {
    return this.state$.value.accessToken;
  }

  get refreshToken(): string | null {
    return this.state$.value.refreshToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.ACCESS, accessToken);
    localStorage.setItem(this.REFRESH, refreshToken);
    this.state$.next({ accessToken, refreshToken });
  }

  logout() {
    localStorage.removeItem(this.ACCESS);
    localStorage.removeItem(this.REFRESH);
    this.state$.next({ accessToken: null, refreshToken: null });
  }

  login(nome: string, senha: string): Observable<void> {
    return this.api.login(nome, senha).pipe(
      tap(res => this.setTokens(res.accessToken, res.refreshToken)),
      map(() => void 0),
    );
  }

  refresh(): Observable<void> {
    const refreshToken = this.refreshToken;
    if (!refreshToken) throw new Error('Sem refresh token');

    return this.api.refresh(refreshToken).pipe(
      tap(res => this.setTokens(res.accessToken, res.refreshToken)),
      map(() => void 0),
    );
  }
}
