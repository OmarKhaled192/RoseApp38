import { computed, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { LoadingState, Message, QueryParams } from '@org/data-access';
import { Product, ProductData } from '@org/ui';
import { ProductService } from '../services/product';
import { UploadService } from '../services/upload';

export interface ProductState extends LoadingState {
  selectedId: string | null;
  isLoading: boolean;
}

const initialState: ProductState = {
  selectedId: null,
  isLoading: false,
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withProps((store, productService = inject(ProductService)) => ({
    productsResource: productService.getListResource(),
  })),

  withComputed(({ productsResource }) => ({
    products: computed(() => productsResource.value()?.payload.data || []),
    productsLoading: computed(() => productsResource.isLoading()),
  })),

  withMethods(
    (
      store,
      productService = inject(ProductService),
      messageService = inject(Message),
      uploadService = inject(UploadService),
      translate = inject(TranslateService)
    ) => ({
      getProductResource(id: () => string) {
        return productService.getProductDetail(id);
      },
      getAllProduct(params?: () => QueryParams) {
        return productService.getListResource(params);
      },

      createProduct: rxMethod<ProductData>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((product) =>
            productService.post(product).pipe(
              tap({
                next: () => {
                  patchState(store, { isLoading: false });
                  messageService.show('success', translate.instant('notifications.product.createSuccess'));
                  store.productsResource.reload();
                },
                error: (err) => {
                  patchState(store, { isLoading: false });
                  messageService.show('error', err.error?.message || translate.instant('notifications.product.createFailed'));
                },
              })
            )
          )
        )
      ),

      updateProduct: rxMethod<{ id: string; product: Partial<Product> }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(({ id, product }) =>
            productService.patch<Partial<Product>, Product>(id, product).pipe(
              tap({
                next: () => {
                  patchState(store, { isLoading: false });
                  store.productsResource.reload();
                  messageService.show('success', translate.instant('notifications.product.updateSuccess'));
                },
                error: (err) => {
                  patchState(store, { isLoading: false });
                  messageService.show('error', err.error?.message || translate.instant('notifications.product.updateFailed'));
                },
              })
            )
          )
        )
      ),

      uploadPhoto(formData: FormData) {
        patchState(store, { isLoading: true });
        return uploadService.post(formData).pipe(
          tap({
            next: () => {
              patchState(store, { isLoading: false });
              messageService.show('success', translate.instant('notifications.profile.photoUpdateSuccess'));
            },
            error: (err) => {
              patchState(store, { isLoading: false });
              messageService.show('error', err.error?.message || translate.instant('notifications.profile.photoUpdateFailed'));
            }
          })
        );
      },

      deleteProduct: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((id) =>
            productService.delete<void>(id).pipe(
              tap({
                next: () => {
                  patchState(store, { isLoading: false });
                  store.productsResource.reload();
                  messageService.show('success', translate.instant('notifications.product.deleteSuccess'));
                },
                error: (err) => {
                  patchState(store, { isLoading: false });
                  messageService.show('error', err.error?.message || translate.instant('notifications.product.deleteFailed'));
                },
              })
            )
          )
        )
      ),
    })
  )
);