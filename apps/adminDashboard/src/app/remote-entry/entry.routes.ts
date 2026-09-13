import { Route } from '@angular/router';
import { DashboardLayout } from '../features/dashboard-layout/dashboard-layout';
import { Dashboard } from '../features/dashboard/pages/dashboard/dashboard';
import { NotFoundPage } from '../features/error-pages/not-found-page/not-found-page';
import { ServerErrorPage } from '../features/error-pages/server-error-page/server-error-page';
import { UnauthorizedPage } from '../features/error-pages/unauthorized-page/unauthorized-page';
import { authGuard } from '@org/auth';

export const remoteRoutes: Route[] = [
    { path: 'unauthorized', component: UnauthorizedPage },
    {
        path: '',
        component: DashboardLayout,
        children: [
            { path: '', component: Dashboard, pathMatch: 'full' },
            {
                path: 'product',
                loadComponent: () =>
                    import('../features/product/component/product/product-list/product-list').then((m) => m.ProductList),
                data: { breadcrumbKey: 'breadcrumb.productList' }
            },
            {
                path: 'product/add',
                loadComponent: () =>
                    import('../features/product/component/product/product').then((m) => m.Product),
                data: { breadcrumbKey: 'breadcrumb.addProduct' }
            },
            {
                path: 'product/edit/:id',
                loadComponent: () =>
                    import('../features/product/component/product/product').then((m) => m.Product),
                data: { breadcrumbKey: 'breadcrumb.editProduct' }
            },
            { path: '404', component: NotFoundPage },
            { path: '500', component: ServerErrorPage },
            { path: '**', component: NotFoundPage },
        ],
        canActivate: [authGuard],
        data: { roles: ['ADMIN'], unauthorizedUrl: '/admin/unauthorized' }
    }

];