import { Routes } from '@angular/router';

export const ARTISTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./artists-list').then(m => m.ArtistsList),
  },
];
