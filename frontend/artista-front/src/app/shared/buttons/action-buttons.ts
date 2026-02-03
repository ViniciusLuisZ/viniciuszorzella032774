import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

type Size = 'sm' | 'xs';

@Component({
  standalone: true,
  selector: 'app-action-buttons',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex gap-2" (click)="$event.stopPropagation()">
      <a
        class="shrink-0 rounded-lg border hover:bg-slate-50"
        [ngClass]="editClass"
        [routerLink]="editLink"
        [title]="editTitle"
      >
        Editar
      </a>

      <button
        type="button"
        class="shrink-0 rounded-lg border hover:bg-red-50 text-red-600 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        [ngClass]="deleteClass"
        [disabled]="disabled"
        (click)="onDeleteClick($event)"
        [title]="deleteTitle"
      >
        Excluir
      </button>
    </div>
  `,
})
export class ActionButtons {
  /** Ex: ['/artists', id, 'edit'] */
  @Input({ required: true }) editLink!: any[];

  @Input() disabled = false;
  @Input() size: Size = 'sm';

  @Input() editTitle = 'Editar';
  @Input() deleteTitle = 'Excluir';

  @Output() delete = new EventEmitter<void>();

  get editClass() {
    return this.size === 'xs'
      ? 'px-2 py-1 text-xs'
      : 'px-3 py-1 text-sm';
  }

  get deleteClass() {
    return this.size === 'xs'
      ? 'px-2 py-1 text-xs'
      : 'px-3 py-1 text-sm';
  }

  onDeleteClick(ev: MouseEvent) {
    ev.stopPropagation();
    this.delete.emit();
  }
}
