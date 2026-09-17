import { Component, computed, inject, input, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FieldConfig, DynamicForm, ProductData, FileUploadFn, FormPage } from '@org/ui';
import { ProductStore } from '../../state/product.store';
import { CategoryStore } from '../../state/cateory.store';
import { OccasionStore } from '../../state/occasion.store';
import { map } from 'rxjs';
import { DataResponse } from '@org/data-access';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product',
  imports: [DynamicForm, FormPage],
  templateUrl: './product.html'
})
export class Product {
  private readonly productStore = inject(ProductStore);
  private readonly occasionStore = inject(OccasionStore);
  private readonly categoryStore = inject(CategoryStore);
  private readonly translate = inject(TranslateService); 
  private route = inject(ActivatedRoute);

  initialData = input<Record<string, any> | null>(null);
  formValues = signal<Record<string, any>>({});

  private routeParams = toSignal(this.route.paramMap);
  productId = computed(() => this.routeParams()?.get('id') ?? null);

  formMode = computed<'create' | 'update'>(() =>
    this.productId() ? 'update' : 'create'
  );

  private readonly occasionResource = this.occasionStore.getAllOccasion();
  private readonly categoryResource = this.categoryStore.getAllCategory();

  readonly productResource = this.productStore.getProductResource(
    computed(() => this.productId() ?? '')
  );

  readonly product = computed(() => {
    const p = this.productResource.value()?.payload.product ?? null;
    if (!p) return null;
    return {
      ...p,
      gallery: typeof p.gallery === 'string' ? JSON.parse(p.gallery) : p.gallery,
    };
  });

  pageTitle = computed(() => {
    if (this.formMode() === 'update') {
      const title = this.product()?.title ?? '';
      return `${this.translate.instant('products.updateProduct')}: ${title}`;
    }
    return this.translate.instant('products.addNewProduct');
  });

  submitLabel = computed(() =>
    this.formMode() === 'update'
      ? this.translate.instant('products.updateProduct')
      : this.translate.instant('products.addProduct')
  );

  readonly categoryOptions = computed(() =>
    this.categoryStore.categories().map((cat) => ({
      label: cat.description,
      value: cat.id,
    }))
  );

  readonly occasionOptions = computed(() =>
    this.occasionStore.occasions().map((occ) => ({
      label: occ.title,
      value: occ.id,
    }))
  );

  fields = computed<FieldConfig[]>(() => [
    { key: 'title', label: this.translate.instant('products.title'), type: 'text', required: true, placeholder: this.translate.instant('products.titlePlaceholder'), row: 1 },
    { key: 'description', label: this.translate.instant('products.description'), type: 'textarea', required: true, placeholder: this.translate.instant('products.descriptionPlaceholder'), row: 2 },
    { key: 'price', label: this.translate.instant('products.price'), type: 'number', required: true, placeholder: this.translate.instant('products.pricePlaceholder'), row: 3 },
    { key: 'discountValue', label: this.translate.instant('products.discount'), type: 'number', placeholder: this.translate.instant('products.discountPlaceholder'), row: 3 },
    {
      key: 'priceAfterDiscount',
      label: this.translate.instant('products.priceAfterDiscount'),
      type: 'number',
      excludeFromSubmit: true,
      placeholder: this.translate.instant('products.pricePlaceholder'),
      readonly: true,
      row: 3,
      computedFrom: {
        fields: ['price', 'discountValue'],
        formula: (price, discount) => price - (price * discount / 100),
      },
    },
    { key: 'stock', label: this.translate.instant('products.quantity'), type: 'number', required: true, placeholder: this.translate.instant('products.quantityPlaceholder'), row: 4 },
    { key: 'cover', label: this.translate.instant('products.coverImage'), type: 'upload', required: true, accept: 'image/*', row: 5, hiddenIn: ['update'] },
    { key: 'gallery', label: this.translate.instant('products.gallery'), type: 'upload', required: true, multiple: true, accept: 'image/*', row: 5, hiddenIn: ['update'] },
    {
      key: 'categoryId', label: this.translate.instant('products.category'), type: 'select', required: true, row: 6,
      options: this.categoryOptions()
    },
    {
      key: 'occasion', label: this.translate.instant('products.occasion'), type: 'select', required: true, row: 7, excludeFromSubmit: true,
      options: this.occasionOptions()
    },
    { key: 'cover', label: this.translate.instant('products.coverImage'), type: 'upload', accept: 'image/*', row: 5, hiddenIn: ['create'] },
    { key: 'gallery', label: this.translate.instant('products.gallery'), type: 'upload', multiple: true, accept: 'image/*', row: 5, hiddenIn: ['create'] },
  ]);

  readonly isLoading = computed(
    () =>
      this.productResource.isLoading() ||
      this.occasionResource.isLoading() ||
      this.categoryResource.isLoading()
  );

  uploadFn: FileUploadFn = (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return this.productStore.uploadPhoto(formData).pipe(
      map(res => (res as unknown as DataResponse<{ url: string }>).payload.url)
    );
  };

  handleSubmit(newProduct: Record<string, any>) {
    const id = this.productId();
    if (id) {
      this.productStore.updateProduct({ id, product: newProduct });
    } else {
      this.productStore.createProduct(newProduct as ProductData);
    }
  }
}