import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ArtistsFacade } from './artists.facade';
import {VoltarBotao} from '../../shared/buttons/voltar-botao';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, VoltarBotao],
  template: `
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-semibold">Adicionar artista</h1>
      <p class="text-sm text-slate-500">Cria artista com nome + foto (multipart)</p>
    </div>

    <voltar-botao [to]="['/artists']"></voltar-botao>

  </div>

  <div class="mt-4 rounded-xl border bg-white p-4 max-w-xl">
    <label class="block text-sm font-medium">Nome</label>
    <input
      class="mt-1 w-full rounded-lg border px-3 py-2"
      [(ngModel)]="name"
      placeholder="Ex.: Serj Tankian"
    />

    <label class="mt-4 block text-sm font-medium">Foto (obrigatória)</label>
    <input
      type="file"
      accept="image/*"
      class="mt-1 block w-full text-sm"
      (change)="onFile($event)"
    />

    <div class="mt-3 text-sm text-slate-600" *ngIf="fileName">
      Arquivo: <span class="font-medium">{{ fileName }}</span>
    </div>

    <p class="mt-3 text-sm text-red-600" *ngIf="error">{{ error }}</p>

    <button
      class="mt-5 w-full rounded-lg bg-black text-white py-2 disabled:opacity-50"
      [disabled]="loading || !canSubmit"
      (click)="submit()"
    >
      {{ loading ? 'Salvando...' : 'Salvar' }}
    </button>
  </div>
  `,
})
export class ArtistCreateComponent {
  facade = inject(ArtistsFacade);
  router = inject(Router);
  private readonly MAX_MB = 20;

  name = '';
  image: File | null = null;
  fileName: string | null = null;

  loading = false;
  error: string | null = null;

  get canSubmit() {
    return this.name.trim().length > 0 && !!this.image;
  }

  onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.error = null;

    if (!file) {
      this.image = null;
      this.fileName = null;
      return;
    }

    const maxBytes = this.MAX_MB * 1024 * 1024;
    if (file.size > maxBytes) {
      this.image = null;
      this.fileName = null;
      input.value = '';
      this.error = `Imagem muito grande. Máximo: ${this.MAX_MB}MB.`;
      return;
    }

    this.image = file;
    this.fileName = file?.name ?? null;
  }

  submit() {
    if (!this.image) return;

    this.loading = true;
    this.error = null;

    this.facade.createArtist({
      nome: this.name.trim(),
      image: this.image,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/artists');
      },
      error: () => {
        this.loading = false;
        this.error = 'Falha ao criar artista';
      },
    });
  }
}
