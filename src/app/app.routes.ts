import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './components/layout';
import { ActivationComponent } from './components/shared/activation/activation.component';
import { LoginComponent } from './components/shared/connexion/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'activate/:token',
    component: ActivationComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./components/views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'elements',
        loadChildren: () => import('./components/views/elements/routes').then((m) => m.routes)
      },
      {
        path: 'restos',
        loadChildren: () => import('./components/views/restos/routes').then((m) => m.routes)
      },
      {
        path: 'users',
        loadChildren: () => import('./components/views/users/routes').then((m) => m.routes)
      },
      {
        path: 'structures',
        loadChildren: () => import('./components/views/structures/routes').then((m) => m.routes)
      },
      {
        path: 'parametres',
        loadChildren: () => import('./components/views/autre/routes').then((m) => m.routes)
      },
    ]
  },
  {
    path: 'activate/:token',
    loadComponent: () => import('./components/shared/activation/activation.component').then(m => m.ActivationComponent),
    data: {
      title: 'Activation'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./components/shared/connexion/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
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
    data: {
      title: 'Page 500'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];



