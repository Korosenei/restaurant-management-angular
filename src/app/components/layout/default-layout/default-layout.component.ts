import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  INavData,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
} from '@coreui/angular';

import { navItems } from './_nav';

import { DefaultFooterComponent } from './default-footer/default-footer.component';
import { DefaultHeaderComponent } from './default-header/default-header.component';

import { AuthService  } from '../../../services/auth-service/auth.service';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
  ]
})
export class DefaultLayoutComponent implements OnInit {
  public allNavItems: INavData[] = [...navItems];
  public navItems: INavData[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = this.authService.getUserRole();
    this.navItems = this.filterNavItemsByRole(role);
  }

  filterNavItemsByRole(role: string): INavData[] {
    const permittedUrls: { [key: string]: string[] } = {
      ADMIN: [
        '/dashboard',
        '/elements/tickets',
        '/elements/transactions',
        '/restos/restaurants',
        '/restos/menus',
        '/restos/consommations',
        '/restos/programmations',
        '/users/utilisateurs',
        '/users/clients',
        '/users/caissiers',
        '/users/managers',
        '/structures/directions',
        '/structures/agences',
        '/parametres/compte',
        '/parametres/configurations'
      ],
      CAISSIER: [
        '/dashboard',
        '/elements/tickets',
        '/elements/transactions',
        '/parametres/compte',
        '/parametres/configurations'
      ],
      MANAGER: [
        '/dashboard',
        '/restos/restaurants',
        '/restos/menus',
        '/restos/consommations',
        '/parametres/compte'
      ],
      CLIENT: [
        '/dashboard',
        '/elements/tickets',
        '/elements/transactions',
        '/parametres/compte'
      ]
    };

    const allowed = permittedUrls[role] || [];

    if (allowed.includes('*')) return this.allNavItems;

    const filtered: INavData[] = [];
    let includeSection = false;

    for (let i = 0; i < this.allNavItems.length; i++) {
  const item = this.allNavItems[i];

  if (item.title) {
    includeSection = false;
  } else if (typeof item.url === 'string' && allowed.includes(item.url)) {
    if (!includeSection && i > 0 && this.allNavItems[i - 1].title) {
      filtered.push(this.allNavItems[i - 1]);
      includeSection = true;
    }
    filtered.push(item);
  }
}

    return filtered;
  }

  onScrollbarUpdate($event: any) {
    // Placeholder pour la gestion future du scroll si besoin
  }
}
