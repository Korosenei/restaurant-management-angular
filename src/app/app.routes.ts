import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './components/layout';

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
        path: 'autre',
        loadChildren: () => import('./components/views/autre/routes').then((m) => m.routes)
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
    path: 'header',
    loadComponent: () => import('./components/shared/web/home/header/header.component').then(m => m.HeaderComponent),
    data: {
      title: 'Header'
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



