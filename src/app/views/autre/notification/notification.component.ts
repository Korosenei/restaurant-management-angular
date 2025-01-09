import { Component } from '@angular/core';
import { PaginationComponent } from '../../composants/pagination/pagination.component';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    PaginationComponent
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

}
