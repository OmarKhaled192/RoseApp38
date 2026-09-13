import { Component, computed, inject, signal } from '@angular/core';
import {
  ReusableTable
} from '../../../../../shared/components/reusable-table/reusable-table';
import { ProductStore } from '../../../state/product.store';
import { Router, RouterLink } from '@angular/router';
import { CheckoutDeleteModalComponent } from '@org/ui';
import { TranslatePipe } from '@ngx-translate/core';
import { ReusableTableActionEvent } from 'apps/adminDashboard/src/app/shared/models/reusable-table.models';

@Component({
  selector: 'app-product-list',
  imports: [ReusableTable, CheckoutDeleteModalComponent, TranslatePipe , RouterLink],
  templateUrl: './product-list.html'
})
export class ProductList {
  private readonly productStore = inject(ProductStore);
  private readonly router = inject(Router);
  deletingProduct = signal(false);

  private readonly productResource = this.productStore.getAllProduct();


  productColumns: any[] = [
  { name: 'title', labelName: 'products.name', type: 'text', bold: true },
  { name: 'price', labelName: 'products.price', type: 'number', suffix: ' EGP' },
  { name: 'stock', labelName: 'products.stock', type: 'number', distinctValuesCondition: '<10' },
  { name: 'sales', labelName: 'products.sales', type: 'number' },
  { name: 'ratingsDisplay', labelName: 'products.ratings', type: 'text' },
  {
    name: 'actions',
    labelName: 'products.actions',
    type: 'actions',
    frozenColumn: true,
    actions: [
      { name: 'edit', labelName: 'products.edit', icon: 'pi pi-pencil', tone: 'primary' },
      { name: 'delete', labelName: 'products.delete', icon: 'pi pi-trash', tone: 'danger' },
    ],
  },
];
  isLoading = computed(() => this.productResource.isLoading());

  products = computed(() =>
    (this.productResource.value()?.payload?.data ?? []).map((p: any) => ({
      ...p,
      sales: p._count?.orderItems ?? 0, 
      ratingsDisplay: `${p.rating}/5 (${p.ratings})`,
    }))
  );

  private productIdToDelete = signal<string | null>(null);

  onAction(event: ReusableTableActionEvent) {
    switch (event.action) {
      case 'edit':
        this.router.navigate(['/admin/product/edit', event.row['id']]);
        break;
      case 'delete':
        this.productIdToDelete.set(event.row['id'] as string);
        this.deletingProduct.set(true);
        break;
    }
  }

  confirmDelete() {
    const id = this.productIdToDelete();
    if (id) {
      this.productStore.deleteProduct(id);
    }
    this.deletingProduct.set(false);
    this.productIdToDelete.set(null);
  }

  cancelDelete() {
    this.deletingProduct.set(false);
    this.productIdToDelete.set(null);
  }
}
