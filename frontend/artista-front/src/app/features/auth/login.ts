import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm rounded-2xl border bg-white p-6">
      <h1 class="text-xl font-semibold">Login</h1>

      <label class="mt-4 block text-sm">Usuário</label>
      <input class="mt-1 w-full rounded-lg border px-3 py-2" [(ngModel)]="nome" />

      <label class="mt-3 block text-sm">Senha</label>
      <input type="password" class="mt-1 w-full rounded-lg border px-3 py-2" [(ngModel)]="senha" />

      <button
        class="mt-5 w-full rounded-lg bg-black text-white py-2 disabled:opacity-50"
        [disabled]="loading"
        (click)="onLogin()"
      >
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>

      <p class="mt-3 text-sm text-red-600" *ngIf="error">{{ error }}</p>
    </div>
  </div>
  `,
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  nome = '';
  senha = '';

  loading = false;
  error: string | null = null;

  onLogin() {
    this.loading = true;
    this.error = null;

    this.auth.login(this.nome, this.senha).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/artists');
      },
      error: () => {
        this.loading = false;
        this.error = 'Falha no login';
      },
    });
  }
}
