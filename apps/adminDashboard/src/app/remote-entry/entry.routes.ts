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
                path: 'occasions',
                loadComponent: () =>
                    import('../features/occasions/occasions-list').then((m) => m.OccasionsList),
            },
            {
                path: 'occasions/add',
                loadComponent: () =>
                    import('../features/occasions/occasion-form').then((m) => m.OccasionForm),
                data: { mode: 'add' },
            },
            {
                path: 'occasions/edit/:id',
                loadComponent: () =>
                    import('../features/occasions/occasion-form').then((m) => m.OccasionForm),
                data: { mode: 'edit' },
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