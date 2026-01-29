import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <div class="min-h-screen bg-slate-50">
    <header class="border-b bg-white">
      <div class="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a routerLink="/artists" class="font-semibold">Artists</a>
        <nav class="flex gap-3 text-sm">
          <a routerLink="/artists" routerLinkActive="font-semibold">Artistas</a>
          <a routerLink="/login" class="text-slate-600">Login</a>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6">
      <router-outlet />
    </main>
  </div>
  `,
})
export class AppLayout {}
