import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../core/api/api.config';
import { Page, PageRequest } from '../../core/api/page.model';
import { Artista, ArtistaCreate } from './artists.model';

@Injectable({ providedIn: 'root' })
export class ArtistsApiService {
  constructor(private http: HttpClient) {}

  listArtists(req: PageRequest) {
    let params = new HttpParams()
      .set('page', req.page)
      .set('size', req.size);

    if (req.sort) params = params.set('sort', req.sort);

    const nome = req.nome?.trim();
    if (nome) params = params.set('nome', nome);

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

  updateArtist(id: number, name: string, image?: File | null) {
    const form = new FormData();
    form.append('name', name);

    if (image) {
      form.append('image', image);
    }

    return this.http.put<any>(`${API_BASE_URL}/artistas/${id}`, form);
  }


  deleteArtist(id: number) {
    return this.http.delete<void>(`${API_BASE_URL}/artistas/${id}`);
  }
}
