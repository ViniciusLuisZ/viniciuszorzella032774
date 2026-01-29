import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Artistas</h1>
    </div>

    <div class="mt-4 rounded-xl border bg-white p-4">
      <p class="text-slate-600">Front configurado. Próximo passo: consumir a API.</p>
    </div>
  `,
})
export class ArtistsList {}
