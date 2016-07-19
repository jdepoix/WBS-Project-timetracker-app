import {Component, Input} from '@angular/core';

import {Booking} from '../../../models/booking/booking';

import {WorkdaysToHoursPipe} from '../../../pipes/workdays-to-hours.pipe';

@Component({
  selector: 'booking',
  templateUrl: 'build/components/bookings/booking/booking.component.html',
  pipes: [WorkdaysToHoursPipe]
})
export class BookingComponent {
  private _isLiveBooking: boolean = false;

  @Input()
  public booking: Booking;

  constructor() {
  }
}
