import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CategoriesService } from '../../services/categories.service';
import { CategoryItem } from '../../models/category.model';
import { Message } from '@org/data-access';

export type CategoryFormMode = 'create' | 'update';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './category-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryForm implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(Message);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  // Allow optional input props if embedded in a modal or parent component
  readonly inputMode = input<CategoryFormMode | undefined>(undefined);
  readonly inputCategoryId = input<string | undefined>(undefined);

  readonly mode = signal<CategoryFormMode>('create');
  readonly categoryId = signal<string | null>(null);
  readonly currentCategory = signal<CategoryItem | null>(null);

  readonly isSubmitting = signal<boolean>(false);
  readonly isUploading = signal<boolean>(false);
  readonly isLoadingCategory = signal<boolean>(false);
  readonly selectedFileName = signal<string>('');
  readonly uploadedImageUrl = signal<string>('');
  readonly isPreviewModalOpen = signal<boolean>(false);

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(200)],
    }),
    image: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly titleText = computed(() => {
    if (this.mode() === 'update') {
      const name = this.currentCategory()?.title || this.form.controls.name.value;
      return name
        ? this.translate.instant('categories.updateCategoryTitle', { name })
        : this.translate.instant('categories.updateCategory');
    }
    return this.translate.instant('categories.addCategoryTitle');
  });

  readonly submitButtonText = computed(() => {
    return this.mode() === 'update'
      ? this.translate.instant('categories.updateCategory')
      : this.translate.instant('categories.addCategory');
  });

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    const effectiveId = this.inputCategoryId() || routeId;
    const effectiveMode = this.inputMode() || (effectiveId ? 'update' : 'create');

    this.mode.set(effectiveMode);

    if (effectiveId) {
      this.categoryId.set(effectiveId);
      this.loadCategory(effectiveId);
    }
  }

  loadCategory(id: string): void {
    this.isLoadingCategory.set(true);
    this.categoriesService
      .getCategoryById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isLoadingCategory.set(false);
          const category = res.payload as unknown as CategoryItem;
          if (category) {
            this.currentCategory.set(category);
            this.form.patchValue({
              name: category.title,
              image: category.image,
            });
            this.uploadedImageUrl.set(category.image);
          }
        },
        error: (err) => {
          this.isLoadingCategory.set(false);
          this.messageService.show(
            'error',
            err.error?.message || this.translate.instant('categories.loadFailed'),
          );
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      this.messageService.show(
        'error',
        this.translate.instant('categories.invalidFileType'),
      );
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      this.messageService.show(
        'error',
        this.translate.instant('categories.fileSizeExceeded'),
      );
      return;
    }

    this.selectedFileName.set(file.name);
    this.isUploading.set(true);

    this.categoriesService.uploadImage(file).subscribe({
      next: (res) => {
        this.isUploading.set(false);
        const imageUrl = res.payload.url;
        this.uploadedImageUrl.set(imageUrl);
        this.form.controls.image.setValue(imageUrl);
        this.messageService.show('success', this.translate.instant('categories.imageUploadSuccess'));
      },
      error: (err) => {
        this.isUploading.set(false);
        this.messageService.show(
          'error',
          err.error?.message || this.translate.instant('categories.imageUploadFailed'),
        );
      },
    });
  }

  openPreviewModal(): void {
    if (this.uploadedImageUrl()) {
      this.isPreviewModalOpen.set(true);
    }
  }

  closePreviewModal(): void {
    this.isPreviewModalOpen.set(false);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, image } = this.form.getRawValue();
    this.isSubmitting.set(true);

    if (this.mode() === 'create') {
      this.categoriesService
        .createCategory({
          title: name.trim(),
          description: name.trim(),
          image,
        })
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.messageService.show('success', this.translate.instant('categories.createSuccess'));
            this.router.navigate(['/admin/categories']);
          },
          error: (err) => {
            this.isSubmitting.set(false);
            this.messageService.show(
              'error',
              err.error?.message || this.translate.instant('categories.createFailed'),
            );
          },
        });
    } else {
      const id = this.categoryId();
      if (!id) return;

      this.categoriesService
        .updateCategory(id, {
          title: name.trim(),
          description: name.trim(),
          ...(image ? { image } : {}),
        })
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.messageService.show('success', this.translate.instant('categories.updateSuccess'));
            this.router.navigate(['/admin/categories']);
          },
          error: (err) => {
            this.isSubmitting.set(false);
            this.messageService.show(
              'error',
              err.error?.message || this.translate.instant('categories.updateFailed'),
            );
          },
        });
    }
  }
}
