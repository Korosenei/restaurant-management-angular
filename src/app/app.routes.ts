import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
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
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'element',
        loadChildren: () => import('./views/elements/routes').then((m) => m.routes)
      },
      {
        path: 'user',
        loadChildren: () => import('./views/user/routes').then((m) => m.routes)
      },
      {
        path: 'service',
        loadChildren: () => import('./views/service/routes').then((m) => m.routes)
      },
      {
        path: 'autre',
        loadChildren: () => import('./views/autre/routes').then((m) => m.routes)
      },
    ]
  },
  {
    path: 'landing',
    loadComponent: () => import('./components/shared/web/home/home.component').then(m => m.HomeComponent),
    data: {
      title: 'Landing page'
    }
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'recover',
    loadComponent: () => import('./views/pages/pwd-forgeted/pwd-forgeted.component').then(m => m.PwdForgetedComponent),
    data: {
      title: 'Mot de passe oublié'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];



