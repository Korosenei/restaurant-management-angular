import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddMenuComponent } from '../../../page-add/add-restos/add-menu/add-menu.component';
import { MENU } from '../../../../../models/model-restos/menu.model';

@Component({
  selector: 'app-list-menu',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './list-menu.component.html',
  styleUrl: './list-menu.component.scss'
})
export class ListMenuComponent implements OnInit {
  menuObj: MENU = new MENU();
  listMenus: MENU[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getMenus();
  }

  getMenus() {
    this.http.get<MENU[]>('http://localhost:3000/menus').subscribe({
      next: (res) => {
        this.listMenus = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des menus', err);
      },
    });
  }

  onEdite(data: MENU) {
    const modalRef = this.modalService.open(AddMenuComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.menuObj = { ...data };

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getMenus();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    const isDelete = confirm(
      'Ce menu sera supprimé après confirmation !!! '
    );
    if (isDelete) {
      const menuToDelete = this.listMenus.find(
        (menu) => menu.id === id
      );
      if (menuToDelete) {
        this.http
          .post<MENU>('http://localhost:3000/deleteMenu', menuToDelete)
          .subscribe({
            next: () => {
              this.listMenus = this.listMenus.filter(
                (menu) => menu.id !== id
              );
              this.http
                .delete<MENU>(`http://localhost:3000/menus/${id}`)
                .subscribe({
                  next: () => {
                    alert('MENU de la liste active avec succès');
                  },
                  error: (err) => {
                    console.error(
                      "Erreur lors de la suppression du menu dans la collection originale",
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                "Erreur lors du déplacement de le vers deletedMenu",
                err
              );
            },
          });
      } else {
        alert("Le menu n'a pas été trouvé.");
      }
    } else {
      alert('La suppression du menu est annulé.');
    }
  }

  onKeyDown(event: KeyboardEvent) {
    console.log('Key down', event.key);
  }

  onKeyPress(event: KeyboardEvent) {
    console.log('Key pressed', event.key);
  }

  onKeyUp(event: KeyboardEvent) {
    console.log('Key up', event.key);
  }
}
