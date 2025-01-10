import { Component } from '@angular/core';
import { Page500Component } from "../../../shared/exceptions/page500/page500.component";

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [Page500Component],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
})
export class TicketComponent {

}
