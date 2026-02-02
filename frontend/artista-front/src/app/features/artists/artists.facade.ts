import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Subject, combineLatest } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { ArtistsApiService } from './artists-api.service';
import { Page, SortDir } from '../../core/api/page.model';
import { Artista, ArtistaCreate } from './artists.model';

type ArtistsUiState = {
  loading: boolean;
  error: string | null;

  search: string;
  sortDir: SortDir;
  page: number;
  size: number;

  result: Page<Artista> | null;
};

const initialState: ArtistsUiState = {
  loading: false,
  error: null,
  search: '',
  sortDir: 'asc',
  page: 0,
  size: 10,
  result: null,
};

@Injectable({ providedIn: 'root' })
export class ArtistsFacade {
  private readonly state$ = new BehaviorSubject<ArtistsUiState>(initialState);
  private readonly reload$ = new Subject<void>();

  readonly vm$ = this.state$.pipe(
    map((s) => {
      const page = s.result;
      return {
        ...s,
        content: page?.content ?? [],
        totalElements: page?.totalElements ?? 0,
        totalPages: page?.totalPages ?? 0,
      };
    }),
  );

  constructor(private api: ArtistsApiService) {
    // dispara carregamento automático quando search/sort/page/size mudar
    const search$ = this.state$.pipe(
      map(s => s.search.trim()),
      debounceTime(300),
      distinctUntilChanged(),
    );

    const sortDir$ = this.state$.pipe(
      map(s => s.sortDir),
      distinctUntilChanged(),
    );

    const page$ = this.state$.pipe(
      map(s => s.page),
      distinctUntilChanged(),
    );

    const size$ = this.state$.pipe(
      map(s => s.size),
      distinctUntilChanged(),
    );

    combineLatest([
      search$,
      sortDir$,
      page$,
      size$,
      this.reload$.pipe(startWith(undefined)), // permite "Recarregar" forçar
    ])
      .pipe(
        switchMap(([search, sortDir, page, size]) => {
          this.patch({ loading: true, error: null });

          const sort = `nome,${sortDir}`;

          return this.api.listArtists({ page, size, sort, nome: search }).pipe(
            tap((result) => this.patch({ result })),
            catchError((err) => {
              this.patch({ error: this.readError(err), result: null });
              return EMPTY;
            }),
            finalize(() => this.patch({ loading: false })),
          );
        }),
      )
      .subscribe();
  }

  init() {
    // primeira carga
    this.reload();
  }

  setSearch(search: string) {
    // volta para primeira página e deixa o stream debounced fazer a chamada
    this.patch({ search, page: 0 });
  }

  setSortDir(dir: SortDir) {
    // volta para página 0 e chama automaticamente (sem debounce)
    this.patch({ sortDir: dir, page: 0 });
    // não precisa chamar reload: sortDir$ já dispara combineLatest
  }

  setPage(page: number) {
    this.patch({ page: Math.max(0, page) });
    // page$ dispara
  }

  setSize(size: number) {
    this.patch({ size, page: 0 });
    // size$ dispara
  }

  reload() {
    this.reload$.next();
  }

  createArtist(payload: ArtistaCreate) {
    return this.api.createArtist(payload).pipe(
      tap(() => this.reload()),
    );
  }

  deleteArtist(id: number) {
    this.patch({ loading: true, error: null });

    return this.api.deleteArtist(id).pipe(
      tap(() => this.reload()),
      finalize(() => this.patch({ loading: false })),
      catchError((err) => {
        this.patch({ error: this.readError(err) });
        return EMPTY;
      }),
    );
  }

  updateArtist(id: number, name: string, image?: File | null) {
    this.patch({ loading: true, error: null });

    return this.api.updateArtist(id, name, image).pipe(
      tap(() => this.reload()),
      finalize(() => this.patch({ loading: false })),
      catchError((err) => {
        this.patch({ error: this.readError(err) });
        return EMPTY;
      }),
    );
  }

  private patch(partial: Partial<ArtistsUiState>) {
    this.state$.next({ ...this.state$.value, ...partial });
  }

  private readError(err: any): string {
    if (!err) return 'Erro desconhecido';
    if (typeof err === 'string') return err;
    if (err?.error?.message) return err.error.message;
    if (err?.message) return err.message;
    return 'Falha ao comunicar com a API';
  }
}
