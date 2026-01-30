import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../core/api/api.config';
import { Page, PageRequest } from '../../core/api/page.model';
import { Artista, ArtistaCreate, ArtistaUpdate, Album } from './artists.model';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArtistsApiService {
  constructor(private http: HttpClient) {}

  listArtists(req: PageRequest) {
    let params = new HttpParams()
      .set('page', req.page)
      .set('size', req.size);

    if (req.sort) params = params.set('sort', req.sort);

    return this.http.get<Page<Artista>>(`${API_BASE_URL}/artistas`, { params });
  }

  createArtist(payload: ArtistaCreate) {
    // Sua API hoje parece aceitar multipart com foto + nome
    // Então deixo duas opções:
    // 1) JSON simples (se você tiver endpoint JSON)
    const form = new FormData();
    form.append('name', payload.nome);
    form.append('image', payload.image);
    return this.http.post<Artista>(`${API_BASE_URL}/artistas`, form);
  }

  updateArtist(id: number, payload: ArtistaUpdate) {
    return this.http.put<Artista>(`${API_BASE_URL}/artistas/${id}`, payload);
  }

  deleteArtist(id: number) {
    return this.http.delete<void>(`${API_BASE_URL}/artistas/${id}`);
  }

  listAlbumsByArtist(artistId: number, req: PageRequest) {
    let params = new HttpParams()
      .set('page', req.page)
      .set('size', req.size);

    if (req.sort) params = params.set('sort', req.sort);

    // Seu endpoint atual: /api/v1/albuns/{artistaId}/artistas
    return this.http.get<Page<Album>>(`${API_BASE_URL}/albuns/${artistId}/artistas`, { params });
  }

  createAlbum(artistId: number, titulo: string, capa: File) {
    const form = new FormData();
    form.append('titulo', titulo);
    form.append('artistaId', String(artistId));
    form.append('capa', capa);

    // Ajuste conforme seu endpoint (no backend está /api/v1/albuns)
    return this.http.post<Album>(`${API_BASE_URL}/albuns`, form);
  }
}
