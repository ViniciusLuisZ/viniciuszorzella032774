import { Injectable } from '@angular/core';
import {BehaviorSubject, EMPTY, throwError} from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import {AlbumApiService} from './album-api.service';

type AlbumsState = {
  loading: boolean;
  error: string | null;

  artistId: number | null;

  page: number;
  size: number;

  result: any | null; // Page<Album> (depois você tipa certinho)
};

type AlbumEditState = {
  loading: boolean;
  error: string | null;
  titulo: string;
  albumId: number | null;
};


const initialState: AlbumsState = {
  loading: false,
  error: null,
  artistId: null,
  page: 0,
  size: 10,
  result: null,
};

@Injectable({ providedIn: 'root' })
export class AlbumFacade {
  private state$ = new BehaviorSubject<AlbumsState>(initialState);
  vm$ = this.state$.asObservable();

  constructor(private api: AlbumApiService) {}

  private editState$ = new BehaviorSubject<AlbumEditState>({
    loading: false,
    error: null,
    titulo: '',
    albumId: null,
  });

  editVm$ = this.editState$.asObservable();

  loadAlbumForEdit(albumId: number) {
    this.editState$.next({ loading: true, error: null, titulo: '', albumId });

    this.api.getAlbum(albumId).pipe(
      tap((al: any) => {
        this.editState$.next({
          loading: false,
          error: null,
          titulo: al?.titulo ?? '',
          albumId,
        });
      }),
      catchError((err) => {
        this.editState$.next({
          loading: false,
          error: this.readError(err),
          titulo: '',
          albumId,
        });
        return EMPTY;
      }),
    ).subscribe();
  }

  setEditTitulo(titulo: string) {
    const s = this.editState$.value;
    this.editState$.next({ ...s, titulo });
  }



  init(artistId: number) {
    this.patch({ artistId, page: 0 });
    this.reload();
  }

  setPage(page: number) {
    this.patch({ page });
    this.reload();
  }

  setSize(size: number) {
    this.patch({ size, page: 0 });
    this.reload();
  }

  reload() {
    const s = this.state$.value;
    if (!s.artistId) return;

    this.patch({ loading: true, error: null });

    this.api.listAlbumsByArtist(s.artistId, s.page, s.size)
      .pipe(
        tap(result => this.patch({ result })),
        catchError((err) => {
          this.patch({ error: this.readError(err) });
          return EMPTY;
        }),
        finalize(() => this.patch({ loading: false })),
      )
      .subscribe();
  }

  get artistId(): number | null {
    return this.state$.value.artistId;
  }


  createAlbum(titulo: string, capa: File) {
    const artistId = this.artistId;
    if (!artistId) throw new Error('artistId não carregado');

    this.patch({ loading: true, error: null });

    return this.api.createAlbum(artistId, titulo, capa).pipe(
      tap(() => this.reload()),
      finalize(() => this.patch({ loading: false })),
      catchError((err) => {
        this.patch({ error: this.readError(err) });
        return EMPTY;
      }),
    );
  }


  deleteAlbum(albumId: number) {
    this.patch({ loading: true, error: null });

    return this.api.deleteAlbum(albumId).pipe(
      // opcional: otimista (remove da lista sem recarregar). Como você já tem reload, mantém simples:
      tap(() => this.reload()),
      finalize(() => this.patch({ loading: false })),
      catchError((err) => {
        this.patch({ error: this.readError(err) });
        return EMPTY;
      }),
    );
  }

  getAlbum(albumId: number) {
    return this.api.getAlbum(albumId).pipe(
      catchError((err) => {
        // opcional: salvar mensagem no state
        this.patch({ error: this.readError(err) });
        return throwError(() => err);
      }),
    );
  }

  updateAlbum(albumId: number, titulo: string, capa?: File | null) {
    this.patch({ loading: true, error: null });

    return this.api.updateAlbum(albumId, titulo, capa).pipe(
      tap(() => this.reload()),
      finalize(() => this.patch({ loading: false })),
      catchError(err => {
        this.patch({ error: this.readError(err) });
        return EMPTY;
      }),
    );
  }

  private patch(p: Partial<AlbumsState>) {
    this.state$.next({ ...this.state$.value, ...p });
  }

  private readError(err: any): string {
    if (!err) return 'Erro desconhecido';
    if (err?.error?.message) return err.error.message;
    if (err?.message) return err.message;
    return 'Falha ao comunicar com a API';
  }
}
