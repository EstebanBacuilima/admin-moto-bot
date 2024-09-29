import { Routes } from '@angular/router';
import { publicGuard } from './core/public.guard';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/public/chat-bot', pathMatch: 'full' },
  {
    path: 'public',
    canActivate: [publicGuard],
    loadChildren: () => import('./presentation/pages/public/public.routes'),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./presentation/pages/private/private.routes'),
  },
  {
    path: '**',
    redirectTo: '/public/chat-bot',
  },
];
