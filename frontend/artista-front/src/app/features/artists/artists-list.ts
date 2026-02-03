import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArtistsFacade } from './artists.facade';
import {Router, RouterLink} from '@angular/router';
import {ActionButtons} from '../../shared/buttons/action-buttons';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ActionButtons],
  template: `

    <div class="mt-4 rounded-xl border bg-white p-4" *ngIf="(vm$ | async) as vm">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold">Artistas</h1>
        </div>

        <div class="flex items-center gap-2">
          <input
            class="w-64 rounded-lg border bg-white px-3 py-2 text-sm"
            placeholder="Buscar por nome..."
            [(ngModel)]="vm.search"
            (ngModelChange)="facade.setSearch($event)"
          />

          <select
            class="rounded-lg border cursor-pointer bg-white px-3 py-2 text-sm"
            [ngModel]="vm.sortDir"
            (ngModelChange)="facade.setSortDir($event)"
          >
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>


          <button
            class="rounded-lg bg-black px-3 py-2 cursor-pointer text-sm text-white"
            (click)="facade.reload()"
          >
            Recarregar
          </button>

          <button
            class="rounded-lg bg-black px-3 py-2 cursor-pointer text-sm text-white"
            routerLink="/artists/new"
          >
            + Novo artista
          </button>


        </div>
      </div>


      <div *ngIf="vm.loading" class="text-sm text-slate-500">Carregando…</div>
      <div *ngIf="vm.error" class="text-sm text-red-600">{{ vm.error }}</div>

      <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3" *ngIf="!vm.loading">
        <div
          class="rounded-xl border overflow-hidden bg-white"
          *ngFor="let a of vm.content"
        >
          <!-- Imagem -->
          <div class="h-50 bg-slate-100 flex items-center justify-center">
            <img
              *ngIf="a.fotoEndereco; else noImage"
              [src]="a.fotoEndereco"
              [alt]="a.nome"
              class="h-full w-full object-contain bg-slate-100"
              loading="lazy"
            />

            <ng-template #noImage>
              <div class="text-slate-400 text-sm">
                Sem imagem
              </div>
            </ng-template>
          </div>

          <!-- Conteúdo -->
          <div class="p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="font-semibold truncate">{{ a.nome }}</div>
                <div class="text-xs text-slate-500">ID: {{ a.id }}</div>
                <div class="text-xs text-slate-500">
                  Álbuns: {{ a.totalAlbuns ?? 0 }}
                </div>
              </div>

              <div class="flex gap-2">
                <a
                  class="shrink-0 rounded-lg border px-3 py-1 text-sm hover:bg-slate-50"
                  [routerLink]="['/artists', a.id]"
                  title="Ver álbuns"
                >
                  Ver álbuns
                </a>

                <app-action-buttons
                  [editLink]="['/artists', a.id, 'edit']"
                  [disabled]="vm.loading"
                  (delete)="onDelete(a.id, a.nome)"
                ></app-action-buttons>
              </div>

            </div>
          </div>
        </div>

      </div>

      <div class="mt-4 flex items-center justify-between text-sm text-slate-600">
        <div>
          Página {{ (vm.result?.number ?? 0) + 1 }} / {{ vm.totalPages }}
          • Total: {{ vm.totalElements }}
        </div>

        <div class="flex items-center gap-2">
          <button class="rounded-lg border px-3 py-1"
                  [disabled]="vm.page === 0 || vm.loading"
                  (click)="facade.setPage(vm.page - 1)">
            Anterior
          </button>

          <button class="rounded-lg border px-3 py-1"
                  [disabled]="(vm.result?.last ?? true) || vm.loading"
                  (click)="facade.setPage(vm.page + 1)">
            Próxima
          </button>

          <select class="rounded-lg border bg-white px-2 py-1"
                  [disabled]="vm.loading"
                  (change)="facade.setSize(+$any($event.target).value)">
            <option [selected]="vm.size===10" value="10">10</option>
            <option [selected]="vm.size===20" value="20">20</option>
            <option [selected]="vm.size===50" value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  `,
})
export class ArtistsList implements OnInit {
  facade = inject(ArtistsFacade);
  vm$ = this.facade.vm$;

  private router = inject(Router);

  ngOnInit() {
    this.facade.init();
  }

  onDelete(id: number, nome: string) {
    const ok = window.confirm(`Excluir o artista "${nome}"?\nEssa ação não pode ser desfeita.`);
    if (!ok) return;

    this.facade.deleteArtist(id).subscribe();
  }
}
