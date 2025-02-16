import { Routes } from '@angular/router';

const publicRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./sign-in/sign-in.component').then((m) => m.SignInComponent),
  },
  {
    path: 'catalog',
    loadComponent: () =>
      import('./catalog/catalog.component').then((m) => m.CatalogComponent),
  },
  {
    path: 'product-detail/:code',
    loadComponent: () =>
      import('./product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
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
