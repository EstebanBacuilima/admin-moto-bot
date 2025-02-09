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
        path: 'category-list',
        loadComponent: () =>
          import('./category-list/category-list.component').then(
            (m) => m.CategoryListComponent
          ),
      },
      {
        path: 'service-list',
        loadComponent: () =>
          import('./service-list/service-list.component').then(
            (m) => m.ServiceListComponent
          ),
      },
      {
        path: 'motorcycle-issue-list',
        loadComponent: () =>
          import('./motorcycle-issue-list/motorcycle-issue-list.component').then(
            (m) => m.MotorcycleIssueListComponent
          ),
      },
      {
        path: 'establishment-list',
        loadComponent: () =>
          import('./establishment-list/establishment-list.component').then(
            (m) => m.EstablishmentListComponent
          ),
      },
      {
        path: 'product-list',
        loadComponent: () =>
          import('./product-list/product-list.component').then(
            (m) => m.ProductListComponent
          ),
      },
      {
        path: 'attribute-list',
        loadComponent: () =>
          import('./attribute-list/attribute-list.component').then(
            (m) => m.AttributeListComponent
          ),
      },
      {
        path: 'catalog-service',
        loadComponent: () =>
          import('./catalog-service/catalog-service.component').then(
            (m) => m.CatalogServiceComponent
          ),
      },
      {
        path: 'catalog',
        loadComponent: () =>
          import('../public/catalog/catalog.component').then((m) => m.CatalogComponent),
      },
      {
        path: '**',
        redirectTo: '/welcome',
      },
    ],
  },
];

export default privateRoutes;
