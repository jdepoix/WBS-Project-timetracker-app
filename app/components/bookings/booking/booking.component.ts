import {Component, Input, AfterViewInit, Pipe, OnInit} from '@angular/core';

import {Booking, BookingSession} from '../../../models/booking/booking';

import {WorkdaysToHoursPipe} from '../../../pipes/workdays-to-hours.pipe';
import {IONIC_DIRECTIVES, DateTime, Alert, NavController, Toast} from "ionic-angular/index";
import {EditLabel} from "../edit/edit-label.component";
import Moment = moment.Moment;
import moment = require("moment/moment");
import {BookingService} from "../../../services/bookings/booking.service";
import {Response} from "@angular/http";
import {CreateBookingComponent} from "../create/create-booking.component";

@Component({
  selector: 'booking',
  directives: [IONIC_DIRECTIVES, EditLabel],
  templateUrl: 'build/components/bookings/booking/booking.component.html',
  pipes: [WorkdaysToHoursPipe]
})

export class BookingComponent{


  // Moment object, but behaves like a String("HH:mm") after set by DateTimePicker via Gui
  public pickedEffort :Moment = moment(new Date().getTime());
  // undefined until user has changed effort
  private _bookingEffort : number;

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
  @Input()
  public allBookings: Array<Booking>;


  constructor( private  _bookingService : BookingService, private _nav: NavController) {



  }






  public changedEffortLabel():void{

    this._bookingEffort = this._momentEffortToWorkdays(this.pickedEffort.toString());
    console.log("changed Effort label: " + this.pickedEffort + "   ---  as workdayseff: "  + this._bookingEffort);
    this.booking.effort = this._bookingEffort;

    this._bookingService.update(this.booking).subscribe((returnedBooking: Booking) => {
        console.log("ret booking after update: " + returnedBooking);
    });

  }


  private _momentEffortToWorkdays(mom :String):number{

    return  +(mom.split(":")[0]) / 8 + +(mom.split(":")[1]) / 60 / 8;

  }

  swipeRight():void{
    this._presentDeleteConfirm((this.booking.effort*8) + "", this.booking.description);
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

    this._nav.push(CreateBookingComponent, {
      workpackage: this.bookingSession.workpackage,
      session: this.bookingSession
    });

  }


  private _presentDeleteConfirm(effort: string, bookingDescr: string): void {
    let alert = Alert.create({
      title: 'Delete Booking?',
      message: bookingDescr + " (ca. "+effort+" h)",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Delete clicked');
            this._bookingService.delete(this.booking).subscribe((returnedDeleteResponse: Response) => {
              console.log("returned Delete Bokking Response: " + returnedDeleteResponse);
              if(returnedDeleteResponse.status == 204){

                this._showToast();
                var index = this.allBookings.indexOf(this.booking, 0);
                if (index > -1) {
                  this.allBookings.splice(index, 1);
                }
              }
            });

          }
        }
      ]
    });
    this._nav.present(alert);
  }




  private _showToast() {

    let toast = Toast.create({
      message: 'Effort changed',
      duration: 1500,
      position: 'bottom'
    });

    toast.onDismiss(() => {
      console.log('Dismissed toast');
    });

    this._nav.present(toast);
  }


}


