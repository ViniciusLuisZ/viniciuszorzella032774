import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { AlbumFacade } from './album.facade';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-xl font-semibold">Álbuns do artista</h1>
      <p class="text-sm text-slate-500">Artista ID: {{ artistId }}</p>
    </div>

    <div class="flex gap-2">

      <button class="rounded-lg border bg-white px-3 py-2 text-sm"
              (click)="router.navigateByUrl('/artists')">
        Voltar
      </button>

      <a class="rounded-lg bg-black px-3 py-2 text-sm text-white"
         [routerLink]="['/artists', artistId, 'album', 'new']">
        + Novo álbum
      </a>
    </div>

  </div>

  <div class="mt-4 rounded-xl border bg-white p-4" *ngIf="(vm$ | async) as vm">
    <div *ngIf="vm.loading" class="text-sm text-slate-500">Carregando…</div>
    <div *ngIf="vm.error" class="text-sm text-red-600">{{ vm.error }}</div>

    <div *ngIf="!vm.loading && (vm.result?.content?.length ?? 0) === 0" class="text-sm text-slate-600">
      Este artista ainda não possui álbuns cadastrados.
    </div>

    <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3" *ngIf="!vm.loading">
      <div class="rounded-xl border overflow-hidden bg-white" *ngFor="let al of (vm.result?.content ?? [])">
        <div class="h-40 flex items-center justify-center bg-slate-100">
          <img
            *ngIf="al.capaEndereco; else noCover"
            [src]="al.capaEndereco"
            [alt]="al.titulo"
            class="max-h-full max-w-full object-contain"
            loading="lazy"
          />
          <ng-template #noCover>
            <div class="text-slate-400 text-sm">Sem capa</div>
          </ng-template>
        </div>

        <div class="p-4">
          <div class="font-semibold truncate">{{ al.titulo }}</div>
          <div class="text-xs text-slate-500">ID: {{ al.id }}</div>
        </div>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between text-sm text-slate-600">
      <div>
        Página {{ (vm.result?.number ?? 0) + 1 }} / {{ (vm.result?.totalPages ?? 0) }}
        • Total: {{ (vm.result?.totalElements ?? 0) }}
      </div>

      <div class="flex items-center gap-2">
        <button class="rounded-lg border px-3 py-1"
                [disabled]="(vm.page ?? 0) === 0 || vm.loading"
                (click)="facade.setPage((vm.page ?? 0) - 1)">
          Anterior
        </button>

        <button class="rounded-lg border px-3 py-1"
                [disabled]="(vm.result?.last ?? true) || vm.loading"
                (click)="facade.setPage((vm.page ?? 0) + 1)">
          Próxima
        </button>

        <select class="rounded-lg border bg-white px-2 py-1"
                [disabled]="vm.loading"
                (change)="facade.setSize(+$any($event.target).value)">
          <option [selected]="(vm.size ?? 10)===10" value="10">10</option>
          <option [selected]="(vm.size ?? 10)===20" value="20">20</option>
          <option [selected]="(vm.size ?? 10)===50" value="50">50</option>
        </select>
      </div>
    </div>
  </div>
  `,
})
export class AlbunsList implements OnInit {
  facade = inject(AlbumFacade);
  vm$ = this.facade.vm$;

  private route = inject(ActivatedRoute);
  router = inject(Router);

  artistId!: number;

  ngOnInit() {
    this.artistId = Number(this.route.snapshot.paramMap.get('id'));
    this.facade.init(this.artistId);
  }
}
