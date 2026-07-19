import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { WishListServices } from '../shared/services/wish-list';
import * as WishlistAction from './wishlist.action';
@Injectable()
export class WishlistEffect {
  _action = inject(Actions);
  _wishlistServices = inject(WishListServices);

  loadWishlist$ = createEffect(() =>
    this._action.pipe(
      ofType(WishlistAction.loadWishlist),
      mergeMap(() =>
        this._wishlistServices.getAllWishlistProduct().pipe(
          map((wishlist) => WishlistAction.loadWishlistSuccess({ wishlist })),
          catchError((error) =>
            of(
              WishlistAction.loadWishlistFailuire({
                error: error.message ?? 'Something went wrong',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
