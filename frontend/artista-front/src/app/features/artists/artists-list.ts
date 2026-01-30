import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArtistsFacade } from './artists.facade';
import {RouterLink} from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="flex items-center justify-between gap-4">
    <div>
      <h1 class="text-xl font-semibold">Artistas</h1>
      <p class="text-sm text-slate-500">Listagem com Facade + BehaviorSubject</p>
    </div>

    <div class="flex items-center gap-2">
      <input
        class="w-64 rounded-lg border bg-white px-3 py-2 text-sm"
        placeholder="Buscar por nome..."
        [(ngModel)]="search"
        (ngModelChange)="facade.setSearch($event)"
      />

      <select
        class="rounded-lg border bg-white px-3 py-2 text-sm"
        (change)="facade.setSortDir(($any($event.target).value))"
      >
        <option value="asc">A → Z</option>
        <option value="desc">Z → A</option>
      </select>

      <button
        class="rounded-lg bg-black px-3 py-2 text-sm text-white"
        (click)="facade.reload()"
      >
        Recarregar
      </button>

      <button
        class="rounded-lg bg-black px-3 py-2 text-sm text-white"
        routerLink="/artists/new"
      >
        + Novo artista
      </button>


    </div>
  </div>

  <div class="mt-4 rounded-xl border bg-white p-4" *ngIf="(vm$ | async) as vm">
    <div *ngIf="vm.loading" class="text-sm text-slate-500">Carregando…</div>
    <div *ngIf="vm.error" class="text-sm text-red-600">{{ vm.error }}</div>

    <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3" *ngIf="!vm.loading">
      <div class="rounded-xl border p-4" *ngFor="let a of vm.content">
        <div class="font-semibold">{{ a.nome }}</div>
        <div class="text-xs text-slate-500">ID: {{ a.id }}</div>
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

  search = '';

  ngOnInit() {
    this.facade.init();
  }
}
