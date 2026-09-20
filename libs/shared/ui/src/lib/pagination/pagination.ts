import { Component, computed, effect, input, output, signal } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
@Component({
  selector: 'lib-pagination',
  imports: [PaginatorModule],
  template: `
<div class="flex justify-center custom-paginator">
       <p-paginator
        (onPageChange)="onPageChange($event)"
        [first]="currentFirst()"
        [rows]="currentSize()"
        [totalRecords]="totalRecords()"
      />
    </div>
    `,
  styleUrl: './pagination.css',
})
export class Pagination {
  totalRecords = input<number>(0);
  first = input<number>(0);
  size = input<number>(10);

  pageChange = output<{ page: number; size: number; first: number }>();

  private readonly internalFirst = signal<number | null>(null);
  private readonly internalSize = signal<number | null>(null);

  readonly currentFirst = computed(() => this.internalFirst() ?? this.first());
  readonly currentSize = computed(() => this.internalSize() ?? this.size());

  constructor() {
    effect(() => {
      // Whenever parent updates the first input, sync internalFirst
      this.first();
      this.internalFirst.set(null);
    });
    effect(() => {
      // Whenever parent updates the size input, sync internalSize
      this.size();
      this.internalSize.set(null);
    });
  }


  onPageChange(event: PaginatorState) {
    const first = event.first ?? 0;
    const size = event.rows ?? 10;

    this.internalFirst.set(first);
    this.internalSize.set(size);

    this.pageChange.emit({
      page: Math.floor(first / size),
      size,
      first,
    });
  }
}
