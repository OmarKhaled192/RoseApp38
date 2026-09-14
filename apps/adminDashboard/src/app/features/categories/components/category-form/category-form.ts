import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CategoriesService } from '../../services/categories.service';
import { CategoryItem } from '../../models/category.model';
import { Message } from '@org/data-access';
import { DynamicForm, FieldConfig, FileUploadFn, FormPage } from '@org/ui';
import { map, Observable } from 'rxjs';

export type CategoryFormMode = 'create' | 'update';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [DynamicForm, FormPage],
  templateUrl: './category-form.html',
})
export class CategoryForm implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(Message);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private routeParams = toSignal(this.route.paramMap);
  
  readonly inputMode = input<CategoryFormMode | undefined>(undefined);
  inputCategoryId = computed(() => this.routeParams()?.get('id') ?? null);
readonly categoryResource = this.categoriesService.getResourceById(
  computed(() => this.inputCategoryId() ?? '')
);

readonly category = computed(() => {
  const c = this.categoryResource.value()?.payload.category ?? null;
  if (!c) return null;
  return {
    ...c,
      name: typeof c.title,
  };
});


  readonly mode = signal<CategoryFormMode>('create');
  readonly categoryId = signal<string | null>(null);
  readonly currentCategory = signal<CategoryItem | null>(null);
  readonly formValues = signal<Record<string, unknown>>({});

  readonly isSubmitting = signal<boolean>(false);
  readonly isLoadingCategory = signal<boolean>(false);
  formMode = computed<'create' | 'update'>(() =>
    this.inputCategoryId() ? 'update' : 'create'
  );

  readonly titleText = computed(() => {
    if (this.formMode() === 'update') {
      const name = this.category()?.title;
      return name
        ? this.translate.instant('categories.updateCategoryTitle', { name })
        : this.translate.instant('categories.updateCategory');
    }
    return this.translate.instant('categories.addCategoryTitle');
  });

  readonly submitButtonText = computed(() => {
    return this.formMode() === 'update'
      ? this.translate.instant('categories.updateCategory')
      : this.translate.instant('categories.addCategory');
  });



  readonly initialData = computed<Record<string, unknown> | null>(() => {
    const category = this.currentCategory();
    return category ? { name: category.title, image: category.image } : null;
  });

  readonly fields = computed<FieldConfig[]>(() => [
    {
      key: 'name',
      label: this.translate.instant('categories.name'),
      type: 'text',
      required: true,
      placeholder: this.translate.instant('categories.namePlaceholder'),
      row: 1,
    },
    {
      key: 'image',
      label: this.translate.instant('categories.image'),
      type: 'upload',
      required: true,
      accept: 'image/jpeg,image/png,image/gif,image/webp',
      row: 2,
      hiddenIn: ['update']

    },
     {
      key: 'image',
      label: this.translate.instant('categories.image'),
      type: 'upload',
      accept: 'image/jpeg,image/png,image/gif,image/webp',
      row: 2,
      hiddenIn: ['create']
    },
  ]);

  readonly uploadFn: FileUploadFn = (file: File) =>
    this.categoriesService.uploadImage(file).pipe(map((res) => res.payload.url));

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    const effectiveId = this.inputCategoryId() || routeId;
    const effectiveMode = this.inputMode() || (effectiveId ? 'update' : 'create');

    this.mode.set(effectiveMode);

    if (effectiveId) {
      this.categoryId.set(effectiveId);
    }
  }


  handleSubmit(category: Record<string, any> | FormData): void {
    const id = this.categoryId();
    const data = category instanceof FormData ? Object.fromEntries(category.entries()) : category;
    const image = typeof data['image'] === 'string' ? data['image'] : '';
    const body = {
      title: String(data['name'] ?? '').trim(),
      description: String(data['name'] ?? '').trim(),
      ...(image ? { image } : {}),
    };

    this.isSubmitting.set(true);
    const request = (id
      ? this.categoriesService.updateCategory(id, body)
      : this.categoriesService.createCategory({ ...body, image })) as Observable<unknown>;

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.messageService.show(
          'success',
          this.translate.instant(id ? 'categories.updateSuccess' : 'categories.createSuccess'),
        );
        this.router.navigate(['/admin/categories']);
      },
      error: (err: unknown) => {
        this.isSubmitting.set(false);
        const apiMessage = (err as { error?: { message?: string } })?.error?.message;
        this.messageService.show(
          'error',
          apiMessage || this.translate.instant(id ? 'categories.updateFailed' : 'categories.createFailed'),
        );
      },
    });
  }
}