import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    data: { layout: 'login' },
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'dashboard',
    data: { layout: 'app' },
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'products',
        data: { layout: 'app' },
        loadChildren: () =>
          import('./pages/products/products.module').then(
            (m) => m.ProductsModule
          ),
      },
    ],
  },
];
