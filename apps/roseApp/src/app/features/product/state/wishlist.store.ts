import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { tap, pipe, switchMap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LoadingState, Message } from '@org/data-access';
import { WishlistService } from '../services/wishlist.service';
import { Wishlist } from '../models/wishlist';

export interface WishlistState extends LoadingState {
  items: Wishlist[];
  isLoading: boolean;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
};

export const WishlistStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      wishlistService = inject(WishlistService),
      messageService = inject(Message),
      translate = inject(TranslateService),
    ) => ({
      addToWishlist: rxMethod<Wishlist>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((itemData) =>
            wishlistService.post(itemData).pipe(
              tap({
                next: (res) => {
                  messageService.show(
                    'success',
                    res.message || translate.instant('notifications.wishlist.addSuccess'),
                  );
                  console.log('3️⃣ next - response: ', res);
                  patchState(store, (state) => ({
                    items: [...state.items, itemData],
                    isLoading: false,
                  }));
                  console.log('5️⃣ after show call');
                },
                error: (err) => {
                  patchState(store, { isLoading: false });
                  messageService.show(
                    'error',
                    err.error?.message || translate.instant('notifications.wishlist.addFailed'),
                  );
                },
              }),
            ),
          ),
        ),
      ),
      
    }),
  ),
);
