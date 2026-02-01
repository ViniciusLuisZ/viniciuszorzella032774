import { Routes } from '@angular/router';

export const ALBUM_ROUTES: Routes = [
  {
    path: ':id/album/new',
    loadComponent: () => import('./album-create').then(m => m.AlbumCreate),
  },
];
