import { Component, computed, inject, input, signal } from '@angular/core';
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  initialData = input<Record<string, any> | null>(null);
  formValues = signal<Record<string, any>>({});

  private routeParams = toSignal(this.route.paramMap);
  productId = computed(() => this.routeParams()?.get('id') ?? null);

  formMode = computed<'create' | 'update'>(() =>
    this.productId() ? 'update' : 'create'
  );

  pageTitle = computed(() =>
    this.formMode() === 'update' ? 'Edit Product' : 'Add a New Product'
  );

  submitLabel = computed(() =>
    this.formMode() === 'update' ? 'Update Product' : 'Add Product'
  );

  private readonly occasionResource = this.occasionStore.getAllOccasion();
  private readonly categoryResource = this.categoryStore.getAllCategory();

  readonly productResource = this.productStore.getProductResource(
    computed(() => this.productId() ?? '')
  );

  readonly product = computed(() => this.productResource.value()?.payload.product ?? null);

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
  

priceAfterDiscount = computed(() => {
  const price = Number(this.formValues()['price']) || 0;
  const discount = Number(this.formValues()['discountValue']) || 0;
  return price - (price * discount / 100);
});

  fields = computed<FieldConfig[]>(() => [
    { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter product title', row: 1 },
    { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Enter product description', row: 2 },
    { key: 'price', label: 'Price', type: 'number', required: true, placeholder: 'Example: 5000', row: 3 },
    { key: 'discountValue', label: 'Discount', type: 'number', placeholder: 'Example: 5', row: 3 },
    { key: 'priceAfterDiscount', label: 'Price after discount', type: 'number', excludeFromSubmit: true, placeholder: 'Example: 5', readonly: true, row: 3 },
    { key: 'stock', label: 'Quantity', type: 'number', required: true, placeholder: 'Example: 200', row: 4 },
    { key: 'cover', label: 'Product cover image', type: 'upload', required: true, accept: 'image/*', row: 5 },
    { key: 'gallery', label: 'Product gallery', type: 'upload', required: true, multiple: true, accept: 'image/*', row: 5 },
    {
      key: 'categoryId', label: 'Category', type: 'select', required: true, row: 6,
      options: this.categoryOptions()
    },
    {
      key: 'occasion', label: 'Occasion', type: 'select', required: true, row: 7,
      options: this.occasionOptions()
    },
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