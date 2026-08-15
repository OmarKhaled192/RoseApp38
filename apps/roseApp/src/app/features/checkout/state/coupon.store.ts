import { computed, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { tap, pipe, switchMap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { LoadingState, Message, QueryParams } from '@org/data-access';
import { CouponService } from '../services/coupons';
import { PromoCode } from '../models/promo-code.interface';

export interface CouponState extends LoadingState {
  coupons: PromoCode[];
  isLoading: boolean;
}

const initialState: CouponState = {
  coupons: [],
  isLoading: false,
};

export const CouponStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps((store, couponService = inject(CouponService)) => ({
    _couponResource: couponService.getListResource(),
  })),
  withComputed(({ _couponResource }) => ({
    couponItems: computed(() => _couponResource.value()?.payload.data || []),
    couponLoading: computed(() => _couponResource.isLoading()),
  })),
  withMethods(
    (
      store,
      couponService = inject(CouponService),
      messageService = inject(Message),
      translate = inject(TranslateService),
    ) => ({
      applyCoupon: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((promoCode) =>
            couponService.post({ code: promoCode }).pipe(
              tap({
                next: (res) => {
                  patchState(store, () => ({
                    isLoading: false,
                  }));

                  messageService.show(
                    'success',
                    res.message || translate.instant('notifications.coupon.appliedSuccess'),
                  );
                },
                error: (err) => {
                  patchState(store, { isLoading: false });
                  messageService.show(
                    'error',
                    err.error?.message || translate.instant('notifications.coupon.applyFailed'),
                  );
                },
              }),
            ),
          ),
        ),
      ),
      getAllCoupons(params?: () => QueryParams) {
        return couponService.getListResource(params);
      },
    }),
  ),
);
