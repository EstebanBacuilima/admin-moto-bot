import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/public/chat-bot', pathMatch: 'full' },
  {
    path: 'public',
    // canActivate: [publicGuardService],
    loadChildren: () => import('./presentation/pages/public/public.routes'),
  },
  {
    path: 'admin',
    // canActivate: [authGuardService],
    loadChildren: () => import('./presentation/pages/private/private.routes'),
  },
  {
    path: '**',
    redirectTo: '/public/chat-bot',
  },
];
