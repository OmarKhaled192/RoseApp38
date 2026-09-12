import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { LoadingState, QueryParams } from '@org/data-access';
import { Occasion } from '../services/occasion';
import { IOccasion } from '../models/products.models';

export interface OccasionState extends LoadingState {
  selectedId: string | null;
  isLoading: boolean;
}

const initialState: OccasionState = {
  selectedId: null,
  isLoading: false,
};

export const OccasionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withProps((store, occasionService = inject(Occasion)) => ({
    occasionsResource: occasionService.getListResource(),
  })),

  withComputed(({ occasionsResource }) => ({
    occasions: computed<IOccasion[]>(() => occasionsResource.value()?.payload.data ?? []),
    occasionsLoading: computed(() => occasionsResource.isLoading()),
  })),

  withMethods((state, occasionService = inject(Occasion)) => ({
    getAllOccasion(params?: () => QueryParams) {
      return occasionService.getListResource(params);
    },
  }))
);