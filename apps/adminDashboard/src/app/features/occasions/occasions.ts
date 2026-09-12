import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { DynamicForm } from '@org/ui';
import { FieldConfig } from '@org/ui';
import { Pagination } from '@org/ui';

export interface OccasionItem {
  id: string;
  name: string;
  products: number;
  image?: string;
}

@Component({
  selector: 'app-occasions',
  standalone: true,
  imports: [CommonModule, DynamicForm, Pagination],
  templateUrl: './occasions.html',
  styleUrl: './occasions.css',
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

  readonly formFields = computed<FieldConfig[]>(() => [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Enter occasion name',
      row: 1,
    },
    {
      key: 'image',
      label: 'Occasion image',
      type: 'upload',
      required: true,
      accept: 'image/*',
      row: 2,
    },
  ]);

  onSearch(value: Event): void {
    const target = value.target as HTMLInputElement;
    this.search.set(target.value);
    this.currentPage.set(1);
  }

  onPageChange({ page }: { page: number; size: number; first: number }): void {
    this.currentPage.set(page + 1);
  }

  onSubmit(event: Record<string, any> = {}): void {
    const name = typeof event?.name === 'string' ? event.name.trim() : '';
    if (!name) return;

    const newItem: OccasionItem = {
      id: crypto.randomUUID(),
      name,
      products: 0,
    };

    this.items.update((current) => [newItem, ...current]);
    this.search.set('');
    this.currentPage.set(1);
  }

  trackById(_index: number, item: OccasionItem): string {
    return item.id;
  }
}
