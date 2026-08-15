import { inject } from '@angular/core';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { LoadingState, QueryParams } from '@org/data-access';
import { Occasion } from '../services/occasion';

export interface OccasionState extends LoadingState {
  selectedId: string | null;
  isLoading: false;
}

const initialState: OccasionState = {
  selectedId: null,
  isLoading: false,
};

export const OccasionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((state, occasionService = inject(Occasion)) => ({
    getAllOccasion(params?: () => QueryParams) {
      return occasionService.getListResource(params);
    },
  })),
);
