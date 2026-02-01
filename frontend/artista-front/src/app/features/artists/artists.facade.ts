import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { ArtistsApiService } from './artists-api.service';
import { Page, SortDir } from '../../core/api/page.model';
import { Artista, ArtistaCreate } from './artists.model';

type ArtistsUiState = {
  loading: boolean;
  error: string | null;

  // query/ui
  search: string;
  sortDir: SortDir;
  page: number;
  size: number;

  // data
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

  readonly vm$ = this.state$.pipe(
    map((s) => {
      const page = s.result;

      // Busca client-side (temporário) — depois vira query na API
      let content = page?.content ?? [];
      const q = s.search.trim().toLowerCase();
      if (q) {
        content = content.filter(a => a.nome?.toLowerCase().includes(q));
      }

      // Ordenação client-side (temporário) — depois manda sort no backend
      content = [...content].sort((a, b) => {
        const an = (a.nome ?? '').toLowerCase();
        const bn = (b.nome ?? '').toLowerCase();
        if (an === bn) return 0;
        const res = an < bn ? -1 : 1;
        return s.sortDir === 'asc' ? res : -res;
      });

      return {
        ...s,
        content,
        totalElements: page?.totalElements ?? 0,
        totalPages: page?.totalPages ?? 0,
      };
    }),
  );

  constructor(private api: ArtistsApiService) {}

  init() {
    // evita reload infinito se chamar várias vezes
    if (this.state$.value.result) return;
    this.reload();
  }

  setSearch(search: string) {
    this.patch({ search, page: 0 });
    // se quiser buscar de verdade na API depois, chama reload aqui
  }

  setSortDir(dir: SortDir) {
    this.patch({ sortDir: dir, page: 0 });
    // depois: reload com sort server-side
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
    this.patch({ loading: true, error: null });

    // Hoje sua API suporta sort via Pageable (se estiver usando Spring Data).
    // Vou mandar sort=nome,asc|desc (não quebra mesmo se ignorar).
    const sort = `nome,${s.sortDir}`;

    this.api.listArtists({ page: s.page, size: s.size, sort })
      .pipe(
        tap(result => {
          console.log('Resposta da API /artistas:', result);
          this.patch({ result });
        }),
        catchError((err) => {
          this.patch({ error: this.readError(err) });
          return EMPTY;
        }),
        finalize(() => this.patch({ loading: false })),
      )
      .subscribe();
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
