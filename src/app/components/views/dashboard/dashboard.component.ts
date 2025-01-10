import { Component } from '@angular/core';
import { WidgetsDropdownComponent } from "../../../widgets/widgets-dropdown/widgets-dropdown.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WidgetsDropdownComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
