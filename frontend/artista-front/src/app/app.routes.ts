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
        loadChildren: () =>
          import('./features/artists/artists.routes').then(m => m.ARTISTS_ROUTES),
      },
    ],
  },

  { path: '**', redirectTo: 'artists' },
];
