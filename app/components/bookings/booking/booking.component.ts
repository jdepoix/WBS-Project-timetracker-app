import {Component, Input, AfterViewInit} from '@angular/core';

import {Booking, BookingSession} from '../../../models/booking/booking';

import {WorkdaysToHoursPipe} from '../../../pipes/workdays-to-hours.pipe';
import {IONIC_DIRECTIVES} from "ionic-angular/index";
import {EditLabel} from "../edit/edit-label.component";
import {Workpackage} from "../../../models/workpackage/workpackage";
import Moment = moment.Moment;
import moment = require("moment/moment");

@Component({
  selector: 'booking',
  directives: [IONIC_DIRECTIVES, EditLabel],
  templateUrl: 'build/components/bookings/booking/booking.component.html',
  pipes: [WorkdaysToHoursPipe]
})

export class BookingComponent{


  private _pickedEffort :Moment = moment().date(new Date().getTime());

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


  public changedEffortLabel():void{


  }

 // this method is actually used
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

  // this method is actually used
  timeStampToDuration(stamp: number): String{

    let start = new Date(stamp*1000);
    let until = new Date();
    let d = until.getDay()-start.getDay();
    let h = until.getHours()-start.getHours();
    let mins = until.getMinutes()-start.getMinutes();
    let formattedTime = '  ' + h + ' h ' + mins + ' min';
    if(d > 0){
      formattedTime = d + ' d(!)' + formattedTime + '\n' + "   --> YOU WORKED TOO LONG";
    }
    return formattedTime;
  }



  public checkout_livebooking (): void{

    console.log("check out!");
  }
}


