import {Component, Input} from '@angular/core';

import {Booking} from '../../../models/booking/booking';

import {WorkdaysToHoursPipe} from '../../../pipes/workdays-to-hours.pipe';
import {IONIC_DIRECTIVES} from "ionic-angular/index";

@Component({
  selector: 'booking',
  directives: [IONIC_DIRECTIVES],
  templateUrl: 'build/components/bookings/booking/booking.component.html',
  pipes: [WorkdaysToHoursPipe]
})
export class BookingComponent {
  private _isLiveBooking: boolean = false;



  @Input()
  public withWpName: boolean;
  @Input()
  public booking: Booking;





  constructor() {



  }
}
