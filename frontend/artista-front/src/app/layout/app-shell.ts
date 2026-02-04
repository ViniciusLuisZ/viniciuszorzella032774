import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-100 overflow-x-hidden">

      <!-- Overlay (mobile) -->
      <div
        *ngIf="drawerOpen"
        class="fixed inset-0 z-40 bg-black/40 lg:hidden"
        (click)="closeDrawer()"
      ></div>

      <!-- Sidebar (desktop) -->
      <aside
        class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col bg-slate-900 text-slate-100"
      >
        <div class="h-16 flex items-center px-6 border-b border-slate-800">
          <span class="text-lg font-semibold tracking-wide">Artistas&Albuns</span>
        </div>

        <nav class="flex-1 px-3 py-4 space-y-1">
          <a
            routerLink="/artists"
            routerLinkActive="bg-slate-800 text-white"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            🎵 <span>Artistas</span>
          </a>
        </nav>

        <div class="border-t border-slate-800 p-4">
          <button
            class="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700 transition"
            (click)="logout()"
          >
            Sair
          </button>
        </div>
      </aside>

      <!-- Drawer (mobile) -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-900 text-slate-100 border-r border-slate-800 lg:hidden
               transform transition-transform duration-200 ease-out"
        [class.translate-x-0]="drawerOpen"
        [class.-translate-x-full]="!drawerOpen"
      >
        <div class="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <span class="text-lg font-semibold tracking-wide">Artistas&Albuns</span>

          <button
            class="rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700 transition"
            (click)="closeDrawer()"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <nav class="px-3 py-4 space-y-1">
          <a
            routerLink="/artists"
            routerLinkActive="bg-slate-800 text-white"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
            (click)="closeDrawer()"
          >
            🎵 <span>Artistas</span>
          </a>
        </nav>

        <div class="mt-auto border-t border-slate-800 p-4">
          <button
            class="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700 transition"
            (click)="logout()"
          >
            Sair
          </button>
        </div>
      </aside>

      <!-- Conteúdo -->
      <div class="lg:pl-64 flex min-h-screen flex-col">

        <!-- Header -->
        <header class="sticky top-0 z-30 bg-white border-b">
          <div class="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 h-16">

            <div class="flex items-center gap-3 min-w-0">
              <!-- Botão menu (mobile) -->
              <button
                class="lg:hidden rounded-lg border bg-white px-3 py-2 text-sm"
                (click)="openDrawer()"
                aria-label="Abrir menu"
              >
                ☰
              </button>

              <div class="min-w-0">
                <div class="text-sm text-slate-700">
                  <span class="text-slate-500">Usuário: </span>
                  <span class="font-medium">{{ (username$ | async) ?? '-' }}</span>
                </div>
              </div>
            </div>

            <!-- Infos (desktop/tablet) -->
            <div class="hidden sm:flex items-center gap-6 text-sm">
              <div class="text-slate-700">
                <span class="text-slate-500">Access Token: </span>
                <span class="font-medium tabular-nums">{{ accessRemaining$ | async }}</span>
              </div>

              <div class="text-slate-700 hidden lg:block">
                <span class="text-slate-500">Refresh Token: </span>
                <span class="font-medium tabular-nums">{{ refreshRemaining$ | async }}</span>
              </div>
            </div>
          </div>

          <!-- Linha extra no mobile para não estourar -->
          <div class="sm:hidden px-4 pb-3 flex items-center gap-4 text-sm">
            <div class="text-slate-700">
              <span class="text-slate-500">Access: </span>
              <span class="font-medium tabular-nums">{{ accessRemaining$ | async }}</span>
            </div>
            <div class="text-slate-700">
              <span class="text-slate-500">Refresh: </span>
              <span class="font-medium tabular-nums">{{ refreshRemaining$ | async }}</span>
            </div>
          </div>
        </header>

        <!-- Main -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AppShell {
  private auth = inject(AuthService);
  private router = inject(Router);

  drawerOpen = false;

  username$ = this.auth.username$;
  accessRemaining$ = this.auth.accessRemaining$;
  refreshRemaining$ = this.auth.refreshRemaining$;

  openDrawer() {
    this.drawerOpen = true;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  logout() {
    this.auth.logout();
    this.closeDrawer();
    this.router.navigateByUrl('/login');
  }
}
