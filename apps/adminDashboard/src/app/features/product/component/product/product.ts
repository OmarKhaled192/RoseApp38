import { Component, computed, inject, signal } from '@angular/core';
import { FieldConfig, DynamicForm, ProductData } from '@org/ui';
import { ProductStore } from '../../state/product.store';
import { CategoryStore } from '../../state/cateory.store';
import { OccasionStore } from '../../state/occasion.store';

@Component({
  selector: 'app-product',
  imports: [DynamicForm],
  templateUrl: './product.html'
})
export class Product {
  private readonly productStore = inject(ProductStore);
  private readonly occasionStore = inject(OccasionStore);
  private readonly categoryStore = inject(CategoryStore);

  private readonly productResource = this.productStore.getAllProduct();
  private readonly occasionResource = this.occasionStore.getAllOccasion();
  private readonly categoryResource = this.categoryStore.getAllCategory();

  readonly products = computed<ProductData[]>(
    () => this.productResource.value()?.payload?.data ?? []
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
    { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter product title', row: 1 },
    { key: 'description', label: 'Description', type: 'textarea', required: true,  placeholder: 'Enter product description', row: 2 },
    { key: 'price', label: 'Price', type: 'number', required: true, placeholder: 'Example: 5000', row: 3 },
    { key: 'discountValue', label: 'Discount', type: 'number', placeholder: 'Example: 5', row: 3 },
    { key: 'priceAfterDiscount', label: 'Price after discount', type: 'number', excludeFromSubmit: true ,placeholder: 'Example: 5', readonly: true, row: 3 },
    { key: 'stock', label: 'Quantity', type: 'number', required: true, placeholder: 'Example: 200', row: 4 },
    { key: 'cover', label: 'Product cover image', type: 'upload', required: true, accept: 'image/*', row: 5 },
    { key: 'gallery', label: 'Product gallery', type: 'upload', required: true, multiple: true, accept: 'image/*', row: 5 },
    {
      key: 'categoryId', label: 'Category', type: 'select', required: true, row: 6,
      options: this.categoryOptions()
    },
    {
      key: 'occasion', label: 'Occasion', type: 'select', required: true, row: 7,
      excludeFromSubmit: true,
      options: this.occasionOptions()
    },
  ]);

  readonly isLoading = computed(
    () =>
      this.productResource.isLoading() ||
      this.occasionResource.isLoading() ||
      this.categoryResource.isLoading()
  );

  handleSubmit(newProduct: any) {
    this.productStore.createProduct(newProduct);
  }

  onUpdate(id: string, updatedData: Partial<Product>) {
    // this.productStore.updateProduct({ id, product: updatedData });
  }

  onDelete(id: string) {
    // this.productStore.deleteProduct(id);
  }
}
