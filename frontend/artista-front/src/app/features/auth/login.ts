import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm rounded-2xl border bg-white p-6">
      <h1 class="text-xl font-semibold">Login</h1>

      <label class="mt-4 block text-sm">Usuário</label>
      <input class="mt-1 w-full rounded-lg border px-3 py-2" [(ngModel)]="nome" />

      <label class="mt-3 block text-sm">Senha</label>
      <input type="password" class="mt-1 w-full rounded-lg border px-3 py-2" [(ngModel)]="senha" />

      <button
        class="mt-5 w-full rounded-lg bg-black text-white py-2"
        (click)="fakeLogin()"
      >
        Entrar (fake)
      </button>

      <p class="mt-3 text-xs text-slate-500">
        Por enquanto isso só seta um token fake pra validar fluxo. Depois liga no endpoint.
      </p>
    </div>
  </div>
  `,
})
export class Login {
  nome = '';
  senha = '';

  constructor(private auth: AuthService, private router: Router) {}

  fakeLogin() {
    this.auth.setToken('FAKE_TOKEN');
    this.router.navigateByUrl('/artists');
  }
}
