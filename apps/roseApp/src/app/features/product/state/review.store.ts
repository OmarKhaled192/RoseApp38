import { LoadingState, Message } from '@org/data-access';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ReviewService } from '../services/review';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { ReviewRequest } from '@org/ui';

export interface ReviewState extends LoadingState {
  review: ReviewRequest[];
  isLoading: boolean;
}

const initialState: ReviewState = {
  review: [],
  isLoading: false,
};

export const ReviewStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      reviewService = inject(ReviewService),
      messageService = inject(Message),
    ) => ({
      addReview: rxMethod<{ reviewData: ReviewRequest }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(({ reviewData }) =>
            reviewService.post(reviewData).pipe(
              tap({
                next: (res) => {
                  patchState(store, { isLoading: false });
                  messageService.show('success', res.message || '');
                },
                error: (err) => {
                  patchState(store, { isLoading: false });
                  messageService.show('error', err.error?.message);
                },
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
