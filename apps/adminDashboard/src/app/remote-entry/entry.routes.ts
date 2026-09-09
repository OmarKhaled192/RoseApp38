import { Route } from '@angular/router';
import { DashboardLayout } from '../features/dashboard-layout/dashboard-layout';
import { Dashboard } from '../features/dashboard/pages/dashboard/dashboard';
import { authGuard } from '@org/auth';

export const remoteRoutes: Route[] = [
    {
        path: '',
        component: DashboardLayout,
        children: [
            { path: '', component: Dashboard, pathMatch: 'full' },
            {
                path: 'product',
                loadComponent: () =>
                    import('../features/product/component/product/product').then((m) => m.Product),
            },

            {
                path: 'product/add',
                loadComponent: () =>
                    import('../features/product/component/product/product').then((m) => m.Product)
            },
            {
                path: 'product/edit/:id',
                loadComponent: () =>
                    import('../features/product/component/product/product').then((m) => m.Product)
            }
        ],
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] }
    },
];