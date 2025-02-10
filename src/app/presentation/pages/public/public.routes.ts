import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';

const publicRoutes: Routes = [
  { path: '', redirectTo: '/chat-bot', pathMatch: 'full' },
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
  // {
  //   path: 'catalog',
  //   loadComponent: () =>
  //     import('./catalog/catalog.component').then((m) => m.CatalogComponent),
  // },
  {
    path: '**',
    redirectTo: '/chat-bot',
  },
];

export default publicRoutes;
