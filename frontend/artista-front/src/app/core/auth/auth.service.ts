import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map, interval, distinctUntilChanged } from 'rxjs';
import { AuthApi } from './auth.api';

type AuthState = {
  username: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessExpMs: number | null;
  refreshExpMs: number | null;
};

function parseJwtPayload(token: string): any {
  const payload = token.split('.')[1];
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decodeURIComponent(escape(json)));
}
function getJwtExpMs(token: string): number | null {
  try {
    const payload = parseJwtPayload(token);
    return payload?.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}
function formatRemaining(ms: number): string {
  if (!ms || ms <= 0) return '00:00';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS = 'access_token';
  private readonly REFRESH = 'refresh_token';
  private readonly USERNAME = 'username';

  private readonly state$ = new BehaviorSubject<AuthState>(this.loadInitialState());

  constructor(private api: AuthApi) {
    // opcional: se refresh expirou enquanto app está aberto, derruba a sessão
    interval(1000).subscribe(() => {
      if (this.isRefreshExpired()) {
        // não navega aqui (service não deveria conhecer Router)
        // o interceptor vai mandar pro /login ao falhar
        this.logout();
      }
    });
  }

  private loadInitialState(): AuthState {
    const accessToken = localStorage.getItem(this.ACCESS);
    const refreshToken = localStorage.getItem(this.REFRESH);
    const username = localStorage.getItem(this.USERNAME);

    return {
      username,
      accessToken,
      refreshToken,
      accessExpMs: accessToken ? getJwtExpMs(accessToken) : null,
      refreshExpMs: refreshToken ? getJwtExpMs(refreshToken) : null,
    };
  }

  // streams pro header
  readonly username$ = this.state$.pipe(map(s => s.username), distinctUntilChanged());

  readonly accessRemaining$ = interval(1000).pipe(
    map(() => formatRemaining((this.state$.value.accessExpMs ?? 0) - Date.now())),
    distinctUntilChanged(),
  );

  readonly refreshRemaining$ = interval(1000).pipe(
    map(() => formatRemaining((this.state$.value.refreshExpMs ?? 0) - Date.now())),
    distinctUntilChanged(),
  );

  get accessToken(): string | null {
    return this.state$.value.accessToken;
  }

  get refreshToken(): string | null {
    return this.state$.value.refreshToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !this.isRefreshExpired();
  }

  isAccessExpired(): boolean {
    const exp = this.state$.value.accessExpMs;
    return !exp || Date.now() >= exp;
  }

  isRefreshExpired(): boolean {
    const exp = this.state$.value.refreshExpMs;
    return !exp || Date.now() >= exp;
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.ACCESS, accessToken);
    localStorage.setItem(this.REFRESH, refreshToken);

    this.state$.next({
      ...this.state$.value,
      accessToken,
      refreshToken,
      accessExpMs: getJwtExpMs(accessToken),
      refreshExpMs: getJwtExpMs(refreshToken),
    });
  }

  // Atualiza só access (porque seu backend refresh hoje não devolve refreshToken)
  private setAccessTokenOnly(accessToken: string) {
    localStorage.setItem(this.ACCESS, accessToken);

    this.state$.next({
      ...this.state$.value,
      accessToken,
      accessExpMs: getJwtExpMs(accessToken),
    });
  }

  logout() {
    localStorage.removeItem(this.USERNAME);
    localStorage.removeItem(this.ACCESS);
    localStorage.removeItem(this.REFRESH);

    this.state$.next({
      username: null,
      accessToken: null,
      refreshToken: null,
      accessExpMs: null,
      refreshExpMs: null,
    });
  }

  login(nome: string): Observable<void> {
    return this.api.login(nome).pipe(
      tap(res => {
        localStorage.setItem(this.USERNAME, nome);
        this.setTokens(res.accessToken, res.refreshToken);
        this.state$.next({ ...this.state$.value, username: nome });
      }),
      map(() => void 0),
    );
  }


  refresh(): Observable<void> {
    const refreshToken = this.refreshToken;
    if (!refreshToken) throw new Error('Sem refresh token');

    return this.api.refresh(refreshToken).pipe(
      tap(res => {
        // seu backend retorna só accessToken (hoje)
        // se depois você passar a retornar refreshToken também, dá pra ajustar:
        // if (res.refreshToken) this.setTokens(res.accessToken, res.refreshToken) else this.setAccessTokenOnly(res.accessToken);
        this.setAccessTokenOnly(res.accessToken);
      }),
      map(() => void 0),
    );
  }
}
