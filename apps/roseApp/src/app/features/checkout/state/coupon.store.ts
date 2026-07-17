import { inject } from "@angular/core";
import { tap, pipe, switchMap } from "rxjs";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LoadingState, Message, QueryParams } from "@org/data-access";
import { CouponService } from "../services/coupons";
import { PromoCode } from "../models/promo-code.interface";

export interface CouponState extends LoadingState {
  coupons: PromoCode[];
  isLoading: boolean;
}

const initialState: CouponState = {
  coupons: [],
  isLoading: false
};

export const CouponStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, couponService = inject(CouponService), messageService = inject(Message)) => ({

    applyCoupon: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((promoCode) =>
          couponService.post({ code: promoCode }).pipe(
            tap({
              next: (res) => {
                patchState(store, () => ({
                  isLoading: false
                }));

                messageService.show('success', res.message || 'تم تطبيق الكوبون بنجاح');
              },
              error: (err) => {
                patchState(store, { isLoading: false });
                messageService.show('error', err.error?.message || 'فشلت تطبيق الكوبون');
              }
            })
          )
        )
      )
    ),
    getAllCoupons(params?: () => QueryParams) {
      return couponService.getListResource(params);
    },
  }))
);
