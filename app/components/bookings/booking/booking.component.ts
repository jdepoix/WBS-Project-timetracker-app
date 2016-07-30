import {Component, Input} from '@angular/core';

import {Booking} from '../../../models/booking/booking';

import {WorkdaysToHoursPipe} from '../../../pipes/workdays-to-hours.pipe';
import {IONIC_DIRECTIVES} from "ionic-angular/index";
import {EditLabel} from "../edit/edit-label.component";

@Component({
  selector: 'booking',
  directives: [IONIC_DIRECTIVES, EditLabel],
  templateUrl: 'build/components/bookings/booking/booking.component.html',
  pipes: [WorkdaysToHoursPipe]
})

export class BookingComponent {
  private _isLiveBooking: boolean = false;


  @Input()
  public withWpName: boolean;
  @Input()
  public booking: Booking;
  @Input()
  public isLive: boolean = true;



  constructor() {

  }


  public checkout_livebooking (booking: Booking): void{

  console.log("check out!");

}
}


