import {Component, Input} from '@angular/core';

import {Booking} from '../../../models/booking/booking';

@Component({
  selector: 'booking',
  templateUrl: 'build/components/bookings/booking/booking.component.html'
})
export class BookingComponent {
  private _isLiveBooking: boolean = false;

  @Input()
  public booking: Booking;

  constructor() {
  }
}
