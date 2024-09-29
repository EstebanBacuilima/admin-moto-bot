import { Routes } from '@angular/router';

const publicRoutes: Routes = [
  { path: '', redirectTo: '/chat-bot', pathMatch: 'full' },
  {
    path: 'chat-bot',
    loadComponent: () =>
      import('./chat-bot/chat-bot.component').then((m) => m.ChatBotComponent),
  },
  {
    path: 'sign-in ',
    loadComponent: () =>
      import('./sign-in/sign-in.component').then((m) => m.SignInComponent),
  },
  {
    path: '**',
    redirectTo: '/chat-bot',
  },
];

export default publicRoutes;
