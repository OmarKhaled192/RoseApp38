import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Pagination } from '@org/ui';

export interface OccasionItem {
  id: string;
  name: string;
  products: number;
  image?: string;
}

@Component({
  selector: 'app-occasions-list',
  standalone: true,
  imports: [CommonModule, RouterLink, Pagination, TranslatePipe],
  templateUrl: './occasions-list.html',
  styleUrl: './occasions-list.css',
})
export class OccasionsList {
  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);

  readonly items = signal<OccasionItem[]>([
    { id: '1', name: 'Wedding', products: 65 },
    { id: '2', name: 'Graduation', products: 32 },
    { id: '3', name: 'Birthday', products: 4 },
    { id: '4', name: 'Anniversary', products: 12 },
    { id: '5', name: 'Anniversary', products: 12 },
    { id: '6', name: 'Anniversary', products: 12 },
    { id: '7', name: 'Anniversary', products: 12 },
    { id: '8', name: 'Anniversary', products: 12 },
    { id: '9', name: 'Anniversary', products: 12 },
    { id: '10', name: 'Anniversary', products: 12 },
    { id: '11', name: 'Anniversary', products: 12 },
    { id: '12', name: 'Anniversary', products: 12 },
    { id: '13', name: 'Anniversary', products: 12 },
  ]);

  readonly filteredItems = computed(() => {
    const query = this.search().trim().toLowerCase();
    const source = this.items();

    if (!query) {
      return source;
    }

    return source.filter((item) => item.name.toLowerCase().includes(query));
  });

  readonly paginatedItems = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredItems().slice(start, start + this.pageSize());
  });

  readonly totalRecords = computed(() => this.filteredItems().length);

  onSearch(value: Event): void {
    const target = value.target as HTMLInputElement;
    this.search.set(target.value);
    this.currentPage.set(1);
  }

  onPageChange({ page }: { page: number; size: number; first: number }): void {
    this.currentPage.set(page + 1);
  }

  trackById(_index: number, item: OccasionItem): string {
    return item.id;
  }
}
