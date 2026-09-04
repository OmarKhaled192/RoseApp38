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
        ],
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] }
    }

];