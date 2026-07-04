import { Component, input, output, signal } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
@Component({
  selector: 'lib-pagination',
  imports: [PaginatorModule],
  template: `
<div class="flex justify-center custom-paginator">
       <p-paginator
        (onPageChange)="onPageChange($event)"
        [first]="first()"
        [rows]="size()"
        [totalRecords]="totalRecords()"
      />
    </div>
    `,
  styleUrl: './pagination.css',
})
export class Pagination {
  totalRecords = input<number>(0);

  pageChange = output<{ page: number; size: number; first: number }>();

  first = signal(0);
  size = signal(10);


  onPageChange(event: PaginatorState) {
    const first = event.first ?? 0;
    const size = event.rows ?? 10;

    this.first.set(first);
    this.size.set(size);

    this.pageChange.emit({
      page: Math.floor(first / size),
      size,
      first,
    });
  }
}
