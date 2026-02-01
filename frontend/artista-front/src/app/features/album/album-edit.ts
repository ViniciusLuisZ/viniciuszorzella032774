import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumFacade } from './album.facade';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold">Editar álbum</h1>
        <p class="text-sm text-slate-500">Atualiza título e (opcional) capa</p>
      </div>

      <button
        class="rounded-lg border bg-white px-3 py-2 text-sm"
        (click)="router.navigateByUrl('/artists/' + artistId)"
      >
        Voltar
      </button>
    </div>

    <div class="mt-4 rounded-xl border bg-white p-4 max-w-xl" *ngIf="vm$ | async as vm">
      <label class="block text-sm font-medium">Título</label>
      <input
        class="mt-1 w-full rounded-lg border px-3 py-2"
        [ngModel]="vm.titulo"
        (ngModelChange)="facade.setEditTitulo($event)"
      />

      <label class="mt-4 block text-sm font-medium">Nova capa (opcional)</label>
      <input
        type="file"
        accept="image/*"
        class="mt-1 block w-full text-sm"
        (change)="onFile($event)"
      />

      <div class="mt-3 text-sm text-slate-600" *ngIf="fileName">
        Arquivo: <span class="font-medium">{{ fileName }}</span>
        <button class="ml-2 underline" type="button" (click)="clearFile()">remover</button>
      </div>

      <!-- erro local do submit (ex.: updateAlbum falhou) -->
      <p class="mt-3 text-sm text-red-600" *ngIf="error">{{ error }}</p>

      <!-- erro do carregamento (vm.error) -->
      <p class="mt-3 text-sm text-red-600" *ngIf="vm.error">{{ vm.error }}</p>

      <button
        class="mt-5 w-full rounded-lg bg-black text-white py-2 disabled:opacity-50"
        [disabled]="vm.loading || !vm.titulo?.trim()"
        (click)="submit(vm.titulo)"
      >
        {{ vm.loading ? 'Salvando...' : 'Salvar' }}
      </button>
    </div>
  `,
})
export class AlbumEdit implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  facade = inject(AlbumFacade);

  vm$ = this.facade.editVm$;

  artistId!: number;
  albumId!: number;

  capa: File | null = null;
  fileName: string | null = null;

  error: string | null = null;

  ngOnInit() {
    this.artistId = Number(this.route.snapshot.paramMap.get('id'));
    this.albumId = Number(this.route.snapshot.paramMap.get('albumId'));
    this.facade.loadAlbumForEdit(this.albumId);
  }

  onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.error = null;

    if (!file) {
      this.clearFile();
      return;
    }

    this.capa = file;
    this.fileName = file.name;
  }

  clearFile() {
    this.capa = null;
    this.fileName = null;
  }

  submit(titulo: string) {
    if (!titulo.trim()) return;

    this.error = null;

    this.facade.updateAlbum(this.albumId, titulo.trim(), this.capa).subscribe({
      next: () => this.router.navigateByUrl(`/artists/${this.artistId}`),
      error: () => {
        this.error = 'Falha ao atualizar álbum';
      },
    });
  }
}
