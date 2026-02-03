import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumFacade } from './album.facade';
import {VoltarBotao} from '../../shared/buttons/voltar-botao';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, VoltarBotao],
  template: `
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-semibold">Adicionar álbum</h1>
      <p class="text-sm text-slate-500">Artista ID: {{ artistId }}</p>
    </div>

    <voltar-botao [to]="['/artists', artistId]"></voltar-botao>

  </div>

  <div class="mt-4 rounded-xl border bg-white p-4 max-w-xl">
    <label class="block text-sm font-medium">Título</label>
    <input
      class="mt-1 w-full rounded-lg border px-3 py-2"
      [(ngModel)]="titulo"
      placeholder="Ex.: Harakiri"
    />

    <label class="mt-4 block text-sm font-medium">Capa (obrigatória)</label>
    <input
      type="file"
      accept="image/*"
      class="mt-1 block w-full text-sm"
      (change)="onFile($event)"
    />

    <div class="mt-3 text-sm text-slate-600" *ngIf="fileName">
      Arquivo: <span class="font-medium">{{ fileName }}</span>
      <button class="ml-2 underline" (click)="clearFile()">remover</button>
    </div>

    <p class="mt-3 text-sm text-red-600" *ngIf="error">{{ error }}</p>

    <button
      class="mt-5 w-full rounded-lg bg-black text-white py-2 disabled:opacity-50"
      [disabled]="loading || !canSubmit"
      (click)="submit()"
    >
      {{ loading ? 'Salvando...' : 'Salvar álbum' }}
    </button>
  </div>
  `,
})
export class AlbumCreate implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  facade = inject(AlbumFacade);

  artistId!: number;

  titulo = '';
  capa: File | null = null;
  fileName: string | null = null;

  loading = false;
  error: string | null = null;

  get canSubmit() {
    return this.titulo.trim().length > 0 && !!this.capa;
  }

  ngOnInit() {
    this.artistId = Number(this.route.snapshot.paramMap.get('id'));
    // garante que o facade sabe qual é o artista (pra criar e depois recarregar)
    this.facade.init(this.artistId);
  }

  onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.error = null;

    if (!file) {
      this.capa = null;
      this.fileName = null;
      return;
    }

    this.capa = file;
    this.fileName = file.name;
  }

  clearFile() {
    this.capa = null;
    this.fileName = null;
  }

  submit() {
    if (!this.capa) return;

    this.loading = true;
    this.error = null;

    this.facade.createAlbum(this.titulo.trim(), this.capa).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/artists', this.artistId]);
      },
      error: () => {
        this.loading = false;
        this.error = 'Falha ao criar álbum';
      },
    });
  }
}
