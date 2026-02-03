import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistsFacade } from './artists.facade';
import {VoltarBotao} from '../../shared/buttons/voltar-botao';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, VoltarBotao],
  template: `
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-semibold">Editar artista</h1>
      <p class="text-sm text-slate-500">Atualiza nome e (opcional) foto</p>
    </div>

    <voltar-botao [to]="['/artists']"></voltar-botao>

  </div>

  <div class="mt-4 rounded-xl border bg-white p-4 max-w-xl">
    <label class="block text-sm font-medium">Nome</label>
    <input
      class="mt-1 w-full rounded-lg border px-3 py-2"
      [(ngModel)]="name"
    />

    <label class="mt-4 block text-sm font-medium">Nova foto (opcional)</label>
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
      {{ loading ? 'Salvando...' : 'Salvar' }}
    </button>
  </div>
  `,
})
export class ArtistEdit implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  facade = inject(ArtistsFacade);

  id!: number;
  name = '';

  image: File | null = null;
  fileName: string | null = null;

  loading = false;
  error: string | null = null;

  get canSubmit() {
    return this.name.trim().length > 0;
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    // pega do estado atual (lista já carregada)
    const current = this.facade['state$']?.value?.result?.content?.find((x: any) => x.id === this.id);
    if (current) this.name = current.nome ?? '';

    // se não achou (ex.: refresh na rota), carregue e depois preencha:
    if (!current) {
      this.facade.reload();
      // sem complicar: o usuário digita; ou você implementa getById depois
    }
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

    this.image = file;
    this.fileName = file.name;
  }

  clearFile() {
    this.image = null;
    this.fileName = null;
  }

  submit() {
    this.loading = true;
    this.error = null;

    this.facade.updateArtist(this.id, this.name.trim(), this.image).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/artists');
      },
      error: () => {
        this.loading = false;
        this.error = 'Falha ao atualizar artista';
      },
    });
  }
}
