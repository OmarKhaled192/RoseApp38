import { Route } from '@angular/router';
import { DashboardLayout } from '../features/dashboard-layout/dashboard-layout';

export const remoteRoutes: Route[] = [
    {
        path: '',
        component: DashboardLayout,
    }
];