import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'voltar-botao',
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="cursor-pointer rounded-lg border bg-white px-3 py-2 text-sm
             hover:bg-slate-50 disabled:opacity-50"
      [disabled]="disabled"
      (click)="goBack()"
    >
      {{ label }}
    </button>
  `,
})
export class VoltarBotao {
  @Input() to?: string | any[];
  @Input() label = 'Voltar';
  @Input() disabled = false;

  constructor(private router: Router) {}

  goBack() {
    if (!this.to) return;

    this.router.navigate(Array.isArray(this.to) ? this.to : [this.to]);
  }
}
