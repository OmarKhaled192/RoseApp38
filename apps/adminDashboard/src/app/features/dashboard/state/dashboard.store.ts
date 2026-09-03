import { computed, effect, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { DashboardService } from '../services/dashboard.service';
import { DashboardPayload, RevenuePeriod } from '../models/dashboard.model';

interface DashboardState {
  dashboard: DashboardPayload | null;
  revenuePeriod: RevenuePeriod;
  lowStockThreshold: number;
  topProductsLimit: number;
  lowStockLimit: number;
}

const initialState: DashboardState = {
  dashboard: null,
  revenuePeriod: 'monthly',
  lowStockThreshold: 20,
  topProductsLimit: 5,
  lowStockLimit: 20,
};

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps((store, dashboardService = inject(DashboardService)) => ({
    _dashboardResource: dashboardService.getDashboardResource(() => ({
      revenuePeriod: store.revenuePeriod(),
      lowStockThreshold: store.lowStockThreshold(),
      topProductsLimit: store.topProductsLimit(),
      lowStockLimit: store.lowStockLimit(),
    })),
  })),
  withComputed((store) => ({
    summary: computed(() => store.dashboard()?.summary ?? null),
    categories: computed(() => store.dashboard()?.categories ?? []),
    orderStatus: computed(() => store.dashboard()?.orderStatus ?? null),
    revenue: computed(() => store.dashboard()?.revenue ?? null),
    topSellingProducts: computed(() => store.dashboard()?.topSellingProducts ?? []),
    lowStockProducts: computed(() => store.dashboard()?.lowStockProducts ?? []),
    isLoading: computed(() => store._dashboardResource.isLoading() && !store.dashboard()),
    isRefreshing: computed(() => store._dashboardResource.isLoading() && !!store.dashboard()),
    error: computed(() => store._dashboardResource.error()),
  })),
  withMethods((store) => ({
    setRevenuePeriod(revenuePeriod: RevenuePeriod): void {
      if (store.revenuePeriod() !== revenuePeriod) {
        patchState(store, { revenuePeriod });
      }
    },
  })),
  withHooks({
    onInit(store) {
      effect(() => {
        const dashboard = store._dashboardResource.value()?.payload;

        if (dashboard) {
          patchState(store, { dashboard });
        }
      });
    },
  }),
);
