import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductStore } from '../../state/product.store';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductInfo } from "../product-info/product-info";
import { ProductReview } from "../product-review/product-review";
import { RelatedProduct } from '../related-product/related-product';

@Component({
  selector: 'app-product-details',
  imports: [ProductInfo, ProductReview,RelatedProduct],
  templateUrl: './product-details.html'
})
export class ProductDetails {
  readonly store = inject(ProductStore);
  readonly route = inject(ActivatedRoute);
  productId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id') || ''))
  );

  readonly productResource = this.store.getProductResource(
    computed(() => this.productId() ?? '')
  );

  readonly product = computed(() => this.productResource.value()?.payload.product ?? null);
  readonly isLoading = computed(() => this.productResource.isLoading());




}
