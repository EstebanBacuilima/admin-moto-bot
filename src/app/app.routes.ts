import { Routes } from '@angular/router';
import { publicGuardService } from './core/public.guard';
import { authGuardService } from './core/auth.guard';

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
