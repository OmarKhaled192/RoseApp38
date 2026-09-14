import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoriesList } from './categories-list';
import { CategoriesService } from '../../services/categories.service';
import { CategoryItem } from '../../models/category.model';
import { Message } from '@org/data-access';

describe('CategoriesList Component', () => {
  let component: CategoriesList;
  let fixture: ComponentFixture<CategoriesList>;
  let router: Router;

  const mockCategories: CategoryItem[] = [
    {
      id: 'cat-1',
      title: 'Flowers',
      description: 'Fresh flowers and bouquets',
      image: '/api/upload/temp/flowers.jpg',
      _count: { products: 65 },
    },
    {
      id: 'cat-2',
      title: 'Gifts',
      description: 'Gift items',
      image: '/api/upload/temp/gifts.jpg',
      _count: { products: 32 },
    },
  ];

  const mockResourceValue = signal({
    status: true,
    code: 200,
    payload: {
      data: mockCategories,
      metadata: { page: 1, limit: 10, total: 25, totalPages: 3 },
    },
  });

  const mockResourceRef = {
    value: mockResourceValue,
    isLoading: signal(false),
    reload: vi.fn(),
  };

  const mockCategoriesService = {
    getCategoriesResource: vi.fn().mockReturnValue(mockResourceRef),
    deleteCategory: vi.fn().mockReturnValue(of(void 0)),
  };

  const mockMessage = {
    show: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [CategoriesList],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: CategoriesService, useValue: mockCategoriesService },
        { provide: Message, useValue: mockMessage },
      ],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      categories: {
        title: 'All Categories',
        addCategory: 'Add a new category',
        products: 'products',
        name: 'Name',
        empty: 'No categories found.',
        deleteModalTitle: 'Delete Category',
        deleteModalConfirm: 'Are you sure you want to delete {{name}}?',
        deleteSuccess: 'Category deleted successfully',
      },
      'reusable-table': {
        edit: 'Edit',
        delete: 'Delete',
      },
      common: {
        cancel: 'Cancel',
      },
      dashboard: {
        breadcrumb: {
          dashboard: 'Dashboard',
        },
      },
    });
    translate.use('en');

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(CategoriesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the CategoriesList component', () => {
    expect(component).toBeTruthy();
    expect(component.currentPage()).toBe(1);
    expect(component.pageSize()).toBe(10);
  });

  it('should populate table data from categories resource', () => {
    const data = component.tableData();
    expect(data.length).toBe(2);
    expect(data[0].id).toBe('cat-1');
    expect(data[0].name).toBe('Flowers');
    expect(data[0].products).toContain('65');
    expect(data[1].name).toBe('Gifts');
  });

  it('should update search term and reset page to 1 after debounce', () => {
    vi.useFakeTimers();
    try {
      component.currentPage.set(3);
      component.searchControl.setValue('Roses');
      vi.advanceTimersByTime(400);

      expect(component.searchTerm()).toBe('Roses');
      expect(component.currentPage()).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('should navigate to edit page when edit action is triggered', () => {
    const row = component.tableData()[0];
    component.onActionClicked({
      action: 'edit',
      row,
      column: component.columns[2],
    });

    expect(router.navigate).toHaveBeenCalledWith(['/admin/categories/edit', 'cat-1']);
  });

  it('should open delete confirmation modal when delete action is triggered', () => {
    const row = component.tableData()[0];
    component.onActionClicked({
      action: 'delete',
      row,
      column: component.columns[2],
    });

    expect(component.categoryToDelete()).toEqual(mockCategories[0]);

    // Close modal
    component.closeDeleteModal();
    expect(component.categoryToDelete()).toBeNull();
  });

  it('should execute deleteCategory and show success notification on confirmDelete', () => {
    component.openDeleteModal(mockCategories[0]);
    component.confirmDelete();

    expect(mockCategoriesService.deleteCategory).toHaveBeenCalledWith('cat-1');
    expect(mockMessage.show).toHaveBeenCalledWith('success', 'Category deleted successfully');
    expect(mockResourceRef.reload).toHaveBeenCalled();
    expect(component.categoryToDelete()).toBeNull();
  });

  it('should change current page when goToPage is called', () => {
    expect(component.totalPages()).toBe(3);
    component.goToPage(2);
    expect(component.currentPage()).toBe(2);
  });
});
