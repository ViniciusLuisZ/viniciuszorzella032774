import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
  <div class="flex h-screen bg-slate-100">

    <!-- SIDEBAR / DRAWER -->
    <aside class="w-64 bg-slate-900 text-slate-100 flex flex-col">
      <!-- Logo / Título -->
      <div class="h-16 flex items-center px-6 border-b border-slate-800">
        <span class="text-lg font-semibold tracking-wide">
          Artistas&Albuns
        </span>
      </div>

      <!-- Menu -->
      <nav class="flex-1 px-3 py-4 space-y-1">
        <a
          routerLink="/artists"
          routerLinkActive="bg-slate-800 text-white"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          🎵
          <span>Artistas</span>
        </a>
      </nav>

      <!-- Footer / Logout -->
      <div class="border-t border-slate-800 p-4">
        <button
          class="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700 transition"
          (click)="logout()"
        >
          Sair
        </button>
      </div>
    </aside>

    <!-- CONTEÚDO -->
    <div class="flex-1 flex flex-col overflow-hidden">

      <!-- HEADER -->
      <header class="h-16 bg-white border-b px-6 flex items-center justify-between">

        <div class="flex items-center gap-6 text-sm">
          <div class="text-slate-700">
            <span class="text-slate-500">Usuário: </span>
            <span class="font-medium">{{ (username$ | async) ?? '-' }}</span>
          </div>

          <div class="text-slate-700">
            <span class="text-slate-500">Access Token: </span>
            <span class="font-medium tabular-nums">{{ accessRemaining$ | async }}</span>
          </div>

          <div class="text-slate-700">
            <span class="text-slate-500">Refresh Token: </span>
            <span class="font-medium tabular-nums">{{ refreshRemaining$ | async }}</span>
          </div>
        </div>
      </header>


      <!-- MAIN -->
      <main class="flex-1 overflow-auto p-6">
        <router-outlet />
      </main>
    </div>

  </div>
  `,
})
export class AppShell {
  private auth = inject(AuthService);
  private router = inject(Router);
  username$ = this.auth.username$;
  accessRemaining$ = this.auth.accessRemaining$;
  refreshRemaining$ = this.auth.refreshRemaining$;

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
