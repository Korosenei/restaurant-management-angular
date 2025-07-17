import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './components/layout';
import { LoginComponent } from './components/shared/connexion/login/login.component';
import { authGuard } from './guards/guard-auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./components/views/dashboard/routes').then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: 'elements',
        loadChildren: () => import('./components/views/elements/routes').then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: 'restos',
        loadChildren: () => import('./components/views/restos/routes').then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: 'users',
        loadChildren: () => import('./components/views/users/routes').then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: 'structures',
        loadChildren: () => import('./components/views/structures/routes').then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: 'parametres',
        loadChildren: () => import('./components/views/autre/routes').then((m) => m.routes),
        canActivate: [authGuard]
      },
    ]
  },
  {
    path: 'activate/:token',
    loadComponent: () => import('./components/shared/activation/activation.component').then(m => m.ActivationComponent),
    canActivate: [authGuard],
    data: {
      title: 'Activation'
    }
  },
  // Suppression de la route login dupliquée
  {
    path: 'recover',
    loadComponent: () => import('./components/shared/connexion/pwd-forgeted/pwd-forgeted.component').then(m => m.PwdForgetedComponent),
    data: {
      title: 'Mot de passe oublié'
    }
  },
  {
    path: '404',
    loadComponent: () => import('./components/shared/exceptions/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./components/shared/exceptions/page500/page500.component').then(m => m.Page500Component),
    canActivate: [authGuard],
    data: {
      title: 'Page 500'
    }
  },
  { path: '**', redirectTo: '404' }
];
