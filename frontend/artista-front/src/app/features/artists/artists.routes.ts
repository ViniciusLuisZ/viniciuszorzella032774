import { Routes } from '@angular/router';

export const ARTISTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./artists-list').then(m => m.ArtistsList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./artist-create.component').then(m => m.ArtistCreateComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./artist-edit').then(m => m.ArtistEdit),
  },
  {
    path: ':id',
    loadComponent: () => import('../album/albuns-list').then(m => m.AlbunsList),
  },
  {
    path: ':id/album/new',
    loadComponent: () => import('../album/album-create').then(m => m.AlbumCreate),
  },
  { path: ':id/album/:albumId/edit',
    loadComponent: () => import('../album/album-edit').then(m => m.AlbumEdit)
  }
];
