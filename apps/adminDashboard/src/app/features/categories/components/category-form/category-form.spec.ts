import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoryForm } from './category-form';
import { CategoriesService } from '../../services/categories.service';
import { Message } from '@org/data-access';

describe('CategoryForm Component', () => {
  let component: CategoryForm;
  let fixture: ComponentFixture<CategoryForm>;
  let router: Router;

  const mockCategoriesService = {
    getCategoryById: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    uploadImage: vi.fn(),
  };

  const mockMessage = {
    show: vi.fn(),
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: vi.fn().mockReturnValue(null),
      },
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    mockCategoriesService.createCategory.mockReturnValue(
      of({ status: true, code: 201, payload: { id: 'cat-new' } }),
    );
    mockCategoriesService.updateCategory.mockReturnValue(
      of({ id: 'cat-1', title: 'Updated Flowers' }),
    );
    mockCategoriesService.uploadImage.mockReturnValue(
      of({
        status: true,
        code: 201,
        payload: { url: '/api/upload/temp/new-image.png' },
      }),
    );
    mockCategoriesService.getCategoryById.mockReturnValue(
      of({
        status: true,
        code: 200,
        payload: {
          id: 'cat-1',
          title: 'Flowers',
          description: 'Flowers description',
          image: '/api/upload/temp/flowers.jpg',
        },
      }),
    );

    await TestBed.configureTestingModule({
      imports: [CategoryForm],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: CategoriesService, useValue: mockCategoriesService },
        { provide: Message, useValue: mockMessage },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      categories: {
        addCategory: 'Add Category',
        updateCategory: 'Update Category',
        addCategoryTitle: 'Add a New Category',
        updateCategoryTitle: 'Update Category: {{name}}',
        createSuccess: 'Category created successfully',
        updateSuccess: 'Category updated successfully',
        imageUploadSuccess: 'Image uploaded successfully',
        backToList: 'Back to Categories',
        name: 'Name',
        namePlaceholder: 'Enter category name',
        nameRequired: 'Category name is required.',
        image: 'Category image',
        uploadFile: 'Upload file',
        changeImage: 'Change image',
        viewImage: 'View category image',
        previewTitle: 'Category Image Preview',
      },
      common: {
        close: 'Close',
      },
    });
    translate.use('en');

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  describe('Create Mode', () => {
    beforeEach(async () => {
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue(null);
      fixture = TestBed.createComponent(CategoryForm);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should initialize in create mode with empty form', () => {
      expect(component).toBeTruthy();
      expect(component.mode()).toBe('create');
      expect(component.form.valid).toBe(false);
      expect(component.titleText()).toBe('Add a New Category');
      expect(component.submitButtonText()).toBe('Add Category');
    });

    it('should handle file selection and upload successfully', () => {
      const mockFile = new File(['dummy-content'], 'test.png', { type: 'image/png' });
      const event = {
        target: {
          files: [mockFile],
        },
      } as unknown as Event;

      component.onFileSelected(event);

      expect(mockCategoriesService.uploadImage).toHaveBeenCalledWith(mockFile);
      expect(component.uploadedImageUrl()).toBe('/api/upload/temp/new-image.png');
      expect(component.form.controls.image.value).toBe('/api/upload/temp/new-image.png');
      expect(mockMessage.show).toHaveBeenCalledWith('success', 'Image uploaded successfully');
    });

    it('should submit new category and navigate to categories list on success', () => {
      component.form.setValue({
        name: 'Gifts',
        image: '/api/upload/temp/new-image.png',
      });
      expect(component.form.valid).toBe(true);

      component.onSubmit();

      expect(mockCategoriesService.createCategory).toHaveBeenCalledWith({
        title: 'Gifts',
        description: 'Gifts',
        image: '/api/upload/temp/new-image.png',
      });
      expect(mockMessage.show).toHaveBeenCalledWith('success', 'Category created successfully');
      expect(router.navigate).toHaveBeenCalledWith(['/admin/categories']);
    });
  });

  describe('Update Mode', () => {
    beforeEach(async () => {
      mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('cat-1');
      fixture = TestBed.createComponent(CategoryForm);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should initialize in update mode and load category details', () => {
      expect(component.mode()).toBe('update');
      expect(component.categoryId()).toBe('cat-1');
      expect(mockCategoriesService.getCategoryById).toHaveBeenCalledWith('cat-1');
      expect(component.form.controls.name.value).toBe('Flowers');
      expect(component.form.controls.image.value).toBe('/api/upload/temp/flowers.jpg');
      expect(component.submitButtonText()).toBe('Update Category');
    });

    it('should update category and navigate on submit', () => {
      component.form.controls.name.setValue('Gift Flowers');
      component.onSubmit();

      expect(mockCategoriesService.updateCategory).toHaveBeenCalledWith('cat-1', {
        title: 'Gift Flowers',
        description: 'Gift Flowers',
        image: '/api/upload/temp/flowers.jpg',
      });
      expect(mockMessage.show).toHaveBeenCalledWith('success', 'Category updated successfully');
      expect(router.navigate).toHaveBeenCalledWith(['/admin/categories']);
    });

    it('should toggle image preview modal', () => {
      expect(component.isPreviewModalOpen()).toBe(false);

      component.openPreviewModal();
      expect(component.isPreviewModalOpen()).toBe(true);

      component.closePreviewModal();
      expect(component.isPreviewModalOpen()).toBe(false);
    });
  });
});
