import {  LoadingState } from "@org/data-access";
import { Product } from "../models/product";
import {  signalStore, withMethods, withState } from '@ngrx/signals';
import {  inject } from "@angular/core";
import { ProductService } from "../services/product";

export interface ProductState extends LoadingState {
  products: Product[];
  selectedId: string | null;
  isLoading: false
}

const initialState: ProductState = {
  products: [],
  selectedId: null,
  isLoading: false
};


export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((state, productService = inject(ProductService)) => ({
    getProductResource(id: () => string) {
      return productService.getResourceById(id());
    }
  })),

)
