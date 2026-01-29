import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type AuthState = {
  token: string | null;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY = 'auth_token';

  private readonly state$ = new BehaviorSubject<AuthState>({
    token: localStorage.getItem(this.KEY),
  });

  token$ = this.state$.asObservable();

  get token(): string | null {
    return this.state$.value.token;
  }

  setToken(token: string | null) {
    if (token) localStorage.setItem(this.KEY, token);
    else localStorage.removeItem(this.KEY);

    this.state$.next({ token });
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
