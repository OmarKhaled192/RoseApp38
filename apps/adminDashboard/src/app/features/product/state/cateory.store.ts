import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { LoadingState, QueryParams } from '@org/data-access';
import { CategoryService } from './../services/category';
import { ICategory } from '../models/category.models';

export interface CategoryState extends LoadingState {
  selectedId: string | null;
  isLoading: boolean;
}

const initialState: CategoryState = {
  selectedId: null,
  isLoading: false,
};

export const CategoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withProps((store, categoryService = inject(CategoryService)) => ({
    categoriesResource: categoryService.getListResource(),
  })),

  withComputed(({ categoriesResource }) => ({
    categories: computed<ICategory[]>(() => categoriesResource.value()?.payload.data ?? []),
    categoriesLoading: computed(() => categoriesResource.isLoading()),
  })),

  withMethods((state, categoryService = inject(CategoryService)) => ({
    getAllCategory(params?: () => QueryParams) {
      return categoryService.getListResource(params);
    },
  }))
);