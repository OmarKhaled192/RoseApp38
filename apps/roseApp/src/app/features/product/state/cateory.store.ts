import { CategoryService } from './../services/category';
import { inject } from '@angular/core';
import { signalStore, withMethods, withState } from '@ngrx/signals';
import { LoadingState, QueryParams } from '@org/data-access';

export interface CategoryState extends LoadingState {
  selectedId: string | null;
  isLoading: false;
}

const initialState: CategoryState = {
  selectedId: null,
  isLoading: false,
};

export const CategoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((state, categoryService = inject(CategoryService)) => ({
   
    getAllCategory(params?: () => QueryParams) {
      return categoryService.getListResource(params);
    },
  })),
);
