import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/api/api.config';
import { Album } from './album.model';

@Injectable({ providedIn: 'root' })
export class AlbumApiService {
  constructor(private http: HttpClient) {}


  listAlbumsByArtist(artistId: number, page: number, size: number, sort = 'titulo,asc') {
    return this.http.get<any>(`${API_BASE_URL}/albuns/${artistId}/artistas`, {
      params: { page, size, sort }
    });
  }


  createAlbum(artistId: number, titulo: string, capa: File) {
    const form = new FormData();
    form.append('titulo', titulo);
    form.append('artistaId', String(artistId));
    form.append('capa', capa);
    console.log('capa type:', capa?.type);
    console.log('capa name:', capa?.name);
    // Ajuste conforme seu endpoint (no backend está /api/v1/albuns)
    return this.http.post<Album>(`${API_BASE_URL}/albuns`, form);
  }


}
