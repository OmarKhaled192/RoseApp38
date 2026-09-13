import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Pagination } from '@org/ui';
import { ReusableTable, ReusableTableActionEvent, ReusableTableColumn } from '../../../../shared/components/reusable-table';
import { OccasionService } from '../../services/occasion.service';
import { Occasion } from '../../models/occasion.model';

export type OccasionItem = Occasion & Record<string, unknown>;

@Component({
  selector: 'app-occasions-list',
  standalone: true,
  imports: [CommonModule, RouterLink, Pagination, TranslatePipe, ReusableTable],
  templateUrl: './occasions-list.html',
  styleUrl: './occasions-list.css',
})
export class OccasionsList {
  private readonly router = inject(Router);
  private readonly occasionService = inject(OccasionService);

  readonly search = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);

  readonly occasionsResource = this.occasionService.getOccasions(() => ({
    search: this.search(),
  }));

  readonly items = computed<OccasionItem[]>(() =>
    (this.occasionsResource.value()?.payload.data ?? []).map((occasion) => ({ ...occasion })),
  );

  readonly columns: readonly ReusableTableColumn[] = [
    { name: 'name', labelName: 'dashboard.occasions.name', type: 'text' },
    { name: 'products', labelName: 'dashboard.occasions.products', type: 'number' },
    {
      name: 'actions',
      labelName: 'dashboard.occasions.actions',
      type: 'actions',
      actions: [
        { name: 'edit', labelName: 'dashboard.occasions.edit', icon: 'pi pi-pencil', tone: 'primary' },
        { name: 'delete', labelName: 'dashboard.occasions.delete', icon: 'pi pi-trash', tone: 'danger' },
      ],
    },
  ];

  readonly filteredItems = computed(() => {
    return this.items();
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

  onTableAction(event: ReusableTableActionEvent<OccasionItem>): void {
    const { action, row } = event;

    if (action === 'edit') {
      this.router.navigate(['/admin/occasions/edit', row.id]);
      return;
    }

    if (action === 'delete') {
      this.occasionService.deleteOccasion(row.id).subscribe(() => this.occasionsResource.reload());
    }
  }

  trackById(_index: number, item: OccasionItem): string {
    return item.id;
  }
}
