import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  ReusableTable,
  ReusableTableActionEvent,
  ReusableTableColumn,
} from '../../../../shared/components/reusable-table';
import { CategoryItem, CategoryTableRow } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { Message } from '@org/data-access';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    TranslatePipe,
    ReusableTable,
  ],
  templateUrl: './categories-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesList {
  private readonly router = inject(Router);
  private readonly categoriesService = inject(CategoriesService);
  private readonly messageService = inject(Message);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl('', { nonNullable: true });

  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly searchTerm = signal<string>('');
  readonly isDeleting = signal<boolean>(false);
  readonly categoryToDelete = signal<CategoryItem | null>(null);

  // Signal query for resource
  readonly categoriesQuery = computed(() => ({
    page: this.currentPage(),
    limit: this.pageSize(),
    ...(this.searchTerm().trim() ? { search: this.searchTerm().trim() } : {}),
  }));

  // Reactive HTTP resource
  readonly categoriesResource = this.categoriesService.getCategoriesResource(
    () => this.categoriesQuery(),
  );

  readonly rawCategories = computed<CategoryItem[]>(() => {
    const res = this.categoriesResource.value();
    if (!res?.payload) return [];
    // Handles payload as array or paginated object { data: CategoryItem[], metadata: ... }
    const payload = res.payload as unknown;
    if (Array.isArray(payload)) return payload as CategoryItem[];
    if (payload && typeof payload === 'object' && 'data' in payload) {
      return ((payload as { data: CategoryItem[] }).data || []) as CategoryItem[];
    }
    return [];
  });

  readonly totalRecords = computed<number>(() => {
    const res = this.categoriesResource.value();
    const payload = res?.payload as unknown;
    if (payload && typeof payload === 'object' && 'metadata' in payload) {
      const meta = (payload as { metadata?: { total?: number } }).metadata;
      if (meta?.total !== undefined) return meta.total;
    }
    return this.rawCategories().length;
  });

  readonly tableData = computed<CategoryTableRow[]>(() =>
    this.rawCategories().map((cat) => ({
      id: cat.id,
      name: cat.title,
      products: `${cat._count?.products ?? 0} ${this.translate.instant('categories.products').toLowerCase()}`,
      image: cat.image,
      raw: cat,
    })),
  );

  readonly columns: readonly ReusableTableColumn[] = [
    {
      name: 'name',
      labelName: 'categories.name',
      type: 'text',
      bold: true,
    },
    {
      name: 'products',
      labelName: 'categories.products',
      type: 'text',
    },
    {
      name: 'actions',
      labelName: '',
      type: 'actions',
      actions: [
        {
          name: 'edit',
          labelName: 'reusable-table.edit',
          icon: 'pi pi-pencil',
          tone: 'primary',
        },
        {
          name: 'delete',
          labelName: 'reusable-table.delete',
          icon: 'pi pi-trash',
          tone: 'danger',
        },
      ],
    },
  ];

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((query) => {
        this.currentPage.set(1);
        this.searchTerm.set(query);
      });
  }

  onActionClicked(event: ReusableTableActionEvent<CategoryTableRow>): void {
    const category = event.row.raw;
    if (event.action === 'edit') {
      this.router.navigate(['/admin/categories/edit', category.id]);
    } else if (event.action === 'delete') {
      this.openDeleteModal(category);
    }
  }

  openDeleteModal(category: CategoryItem): void {
    this.categoryToDelete.set(category);
  }

  closeDeleteModal(): void {
    this.categoryToDelete.set(null);
  }

  confirmDelete(): void {
    const category = this.categoryToDelete();
    if (!category) return;

    this.isDeleting.set(true);
    this.categoriesService.deleteCategory(category.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.closeDeleteModal();
        this.messageService.show('success', this.translate.instant('categories.deleteSuccess'));
        this.categoriesResource.reload();
      },
      error: (err) => {
        this.isDeleting.set(false);
        this.messageService.show(
          'error',
          err.error?.message || this.translate.instant('categories.deleteFailed'),
        );
      },
    });
  }

  onPageChange(event: { page: number; size: number; first: number }): void {
    this.currentPage.set(event.page + 1);
    this.pageSize.set(event.size);
  }
}
