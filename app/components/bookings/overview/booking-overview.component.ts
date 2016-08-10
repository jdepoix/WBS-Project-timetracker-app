import {Component} from '@angular/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
  templateUrl: 'build/components/bookings/overview/booking-overview.component.html',
  pipes: [TranslatePipe]
})
export class BookingOverviewComponent {
  constructor() {
  }
}
