import { Route } from '@angular/router';
import { DashboardLayout } from '../features/dashboard-layout/dashboard-layout';
import { Dashboard } from '../features/dashboard/pages/dashboard/dashboard';
import { CategoriesList } from '../features/categories/pages/categories-list/categories-list';
import { CategoryForm } from '../features/categories/components/category-form/category-form';
import { authGuard } from '@org/auth';

export const remoteRoutes: Route[] = [
    {
        path: '',
        component: DashboardLayout,
        children: [
            { path: '', component: Dashboard, pathMatch: 'full' },
            { path: 'categories', component: CategoriesList },
            { path: 'categories/add', component: CategoryForm },
            { path: 'categories/edit/:id', component: CategoryForm },
        ],
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] }
    }

];