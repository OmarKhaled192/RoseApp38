import { LoadingState, QueryParams } from '@org/data-access';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ProductService } from '../services/product';

export interface ProductState extends LoadingState {
  selectedId: string | null;
  isLoading: false;
}

const initialState: ProductState = {
  selectedId: null,
  isLoading: false,
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((state, productService = inject(ProductService)) => ({
    getProductResource(id: () => string) {
      return productService.getProductDetail(id);
    },
    getAllProduct(params?: () => QueryParams) {
      return productService.getListResource(params);
    },
  })),
);
