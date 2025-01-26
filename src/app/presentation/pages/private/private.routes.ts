import { BrandListComponent } from './brand-list/brand-list.component';
import { Routes } from '@angular/router';

const privateRoutes: Routes = [
  {
    path: '',
    loadComponent: () => {
      return import('../../components/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      );
    },
    children: [
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      {
        path: 'welcome',
        loadComponent: () =>
          import('./welcome/welcome.component').then((m) => m.WelcomeComponent),
      },
      {
        path: 'brand-list',
        loadComponent: () =>
          import('./brand-list/brand-list.component').then(
            (m) => m.BrandListComponent
          ),
      },
      {
        path: '**',
        redirectTo: '/welcome',
      },
    ],
  },
];

export default privateRoutes;
