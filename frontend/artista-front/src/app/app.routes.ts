import { Routes } from '@angular/router';
import { AppShell } from './layout/app-shell';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'artists' },

{
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login').then(m => m.Login),
  },

  {
    path: '',
    component: AppShell,
    canActivate: [authGuard],
    children: [
      {
        path: 'artists',
        loadComponent: () =>
          import('./features/artists/artists-list')
            .then(m => m.ArtistsList),
      },
    ],
  },

  { path: '**', redirectTo: 'artists' },
];
