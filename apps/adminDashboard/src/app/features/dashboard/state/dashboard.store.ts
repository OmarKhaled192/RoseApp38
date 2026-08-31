import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { DashboardService } from '../services/dashboard.service';
import { RevenuePeriod } from '../models/dashboard.model';

interface DashboardState {
  revenuePeriod: RevenuePeriod;
  lowStockThreshold: number;
  topProductsLimit: number;
  lowStockLimit: number;
}

const initialState: DashboardState = {
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
  withComputed(({ _dashboardResource }) => ({
    summary: computed(() => _dashboardResource.value()?.payload.summary ?? null),
    categories: computed(() => _dashboardResource.value()?.payload.categories ?? []),
    orderStatus: computed(() => _dashboardResource.value()?.payload.orderStatus ?? null),
    revenue: computed(() => _dashboardResource.value()?.payload.revenue ?? null),
    topSellingProducts: computed(
      () => _dashboardResource.value()?.payload.topSellingProducts ?? [],
    ),
    lowStockProducts: computed(
      () => _dashboardResource.value()?.payload.lowStockProducts ?? [],
    ),
    isLoading: computed(() => _dashboardResource.isLoading()),
    error: computed(() => _dashboardResource.error()),
  })),
  withMethods((store) => ({
    setRevenuePeriod(revenuePeriod: RevenuePeriod): void {
      if (store.revenuePeriod() !== revenuePeriod) {
        patchState(store, { revenuePeriod });
      }
    },
  })),
);
