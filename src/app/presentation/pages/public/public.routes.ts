import { Routes } from '@angular/router';

const publicRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    children: [
      { path: '', redirectTo: 'catalog', pathMatch: 'full' },
      {
        path: 'catalog',
        loadComponent: () =>
          import('./catalog/catalog.component').then((m) => m.CatalogComponent),
      },
      {
        path: 'catalog-service',
        loadComponent: () =>
          import('./catalog-service/catalog-service.component').then((m) => m.CatalogServiceComponent),
      },
      {
        path: 'catalog/:code',
        loadComponent: () =>
          import('./catalog-product-list/catalog-product-list.component').then((m) => m.CatalogProductListComponent),
      },
      {
        path: 'product-detail/:code',
        loadComponent: () =>
          import('./product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent
          ),
      },
      {
        path: '**',
        redirectTo: 'catalog',

      },
    ]
  },
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./sign-in/sign-in.component').then((m) => m.SignInComponent),
  },
  {
    path: 'product-detail/:code',
    loadComponent: () =>
      import('./product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  // {
  //   path: 'catalog',
  //   loadComponent: () =>
  //     import('./catalog/catalog.component').then((m) => m.CatalogComponent),
  // },
  {
    path: 'schedule-appointment',
    loadComponent: () =>
      import('./schedule-appointment/schedule-appointment.component').then(
        (m) => m.ScheduleAppointmentComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/home',

  },
];

export default publicRoutes;
