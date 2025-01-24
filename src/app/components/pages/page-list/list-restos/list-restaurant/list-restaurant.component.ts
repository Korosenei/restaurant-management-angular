import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRestaurantComponent } from '../../../page-add/add-restos/add-restaurant/add-restaurant.component';
import { RESTAURANT } from '../../../../../models/model-restos/restaurant.model';

@Component({
  selector: 'app-list-restaurant',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './list-restaurant.component.html',
  styleUrl: './list-restaurant.component.scss'
})
export class ListRestaurantComponent implements OnInit {
  restaurantObj: RESTAURANT = new RESTAURANT();
  listRestaurants: RESTAURANT[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getRestaurants();
  }

  getRestaurants() {
    this.http.get<RESTAURANT[]>('http://localhost:3000/restaurants').subscribe({
      next: (res) => {
        this.listRestaurants = res;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des restaurants', err);
      },
    });
  }

  onEdite(data: RESTAURANT) {
    const modalRef = this.modalService.open(AddRestaurantComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.restaurantObj = { ...data };

    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.getRestaurants();
        }
      },
      (reason) => {
        console.log('Modal dismissed: ' + reason);
      }
    );
  }

  onDelete(id: number) {
    const isDelete = confirm(
      'Ce restaurant sera supprimé après confirmation !!! '
    );
    if (isDelete) {
      const restaurantToDelete = this.listRestaurants.find(
        (restaurant) => restaurant.id === id
      );
      if (restaurantToDelete) {
        this.http
          .post<RESTAURANT>('http://localhost:3000/deleteRestaurant', restaurantToDelete)
          .subscribe({
            next: () => {
              this.listRestaurants = this.listRestaurants.filter(
                (restaurant) => restaurant.id !== id
              );
              this.http
                .delete<RESTAURANT>(`http://localhost:3000/restaurants/${id}`)
                .subscribe({
                  next: () => {
                    alert('RESTAURANT de la liste active avec succès');
                  },
                  error: (err) => {
                    console.error(
                      "Erreur lors de la suppression du restaurant dans la collection originale",
                      err
                    );
                  },
                });
            },
            error: (err) => {
              console.error(
                "Erreur lors du déplacement de le vers deletedRestaurant",
                err
              );
            },
          });
      } else {
        alert("Le restaurant n'a pas été trouvé.");
      }
    } else {
      alert('La suppression du restaurant est annulé.');
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
