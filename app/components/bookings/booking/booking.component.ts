import {Component, Input, AfterViewInit} from '@angular/core';

import {Booking, BookingSession} from '../../../models/booking/booking';

import {WorkdaysToHoursPipe} from '../../../pipes/workdays-to-hours.pipe';
import {IONIC_DIRECTIVES} from "ionic-angular/index";
import {EditLabel} from "../edit/edit-label.component";
import {Workpackage} from "../../../models/workpackage/workpackage";

@Component({
  selector: 'booking',
  directives: [IONIC_DIRECTIVES, EditLabel],
  templateUrl: 'build/components/bookings/booking/booking.component.html',
  pipes: [WorkdaysToHoursPipe]
})

export class BookingComponent{

  /*
  * if this.isLife is true, booking is null
  * otherwise bookingSession will be null
  *
  * */

  @Input()
  public withWpName: boolean;
  @Input()
  public booking: Booking;
  @Input()
  public bookingSession: BookingSession;
  @Input()
  public isLive: boolean;



  constructor() {


  }



  timeStampToTime(stamp: number): String{

  let date = new Date(stamp*1000);
// Hours part from the timestamp
  let hours = date.getHours();
// Minutes part from the timestamp
  let minutes = "0" + date.getMinutes();
// Will display time in 10:30:23 format
  let formattedTime = hours + ':' + minutes.substr(-2);
  return formattedTime;
}

  timeStampToDuration(stamp: number): String{

    let now:number = new Date().getTime();
    let date = new Date(now-stamp*1000);
// Hours part from the timestamp
    let hours = date.getHours();
// Minutes part from the timestamp
    let minutes = "0" + date.getMinutes();
// Will display time in 10:30:23 format
    let formattedTime = '  ' + hours + ' h ' + minutes.substr(-2) + ' min';
    return formattedTime;
  }



  public checkout_livebooking (): void{

    console.log("check out!");
  }
}


