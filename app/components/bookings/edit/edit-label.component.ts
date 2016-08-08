import {Component, Input} from '@angular/core';

import {IONIC_DIRECTIVES, NavController, Toast} from "ionic-angular/index";
import {Booking} from "../../../models/booking/booking";
import {HoursToWorkdaysPipe} from "../../../pipes/hours-to-workdays.pipe";
import {BookingService} from "../../../services/bookings/booking.service";



@Component({
  selector: 'edit-label',
  directives: [IONIC_DIRECTIVES],
  templateUrl: 'build/components/bookings/edit/edit-label.component.html',
  pipes: [HoursToWorkdaysPipe]
})

export class EditLabel {

  private _is_edit_mode: boolean = false;
  private _rememberValue: String= "";

  @Input()
  public _text: String;
  @Input()
  public booking: Booking;

  constructor( private _navController: NavController,
               private _bookingService: BookingService) {

  }


  _update_booking ():void{

    console.log("will update Booking :  :  " + this.booking);
    this.booking.description = String(this._text);

    //TODO: update und create vom booking service geht nicht - check Backend for errors:

    /*
    *POST /api/projects/3/bookings/
     HTTP 400 Bad Request

     {
     "detail": "JSON parse error - Extra data: line 20 column 6 - line 20 column 7 (char 614 - 615)"
     }


     File "...WBS-Project-timetracker-backend\wbs_timetracker\api\bookings\serializers.py", line 33, in create
     if workpackage.is_toplevel_wp:
     AttributeError: 'OrderedDict' object has no attribute 'is_toplevel_wp
    *
    * */

    this.showToast();
    this._bookingService.update(this.booking).subscribe((returnedBooking: Booking) => {
      console.log("ret_booking after update: " + returnedBooking);
    });

  }



  showToast() {

    let toast = Toast.create({
      message: 'Description changed',
      duration: 1500,
      position: 'bottom'
    });

    toast.onDismiss(() => {
      console.log('Dismissed toast');
    });

    this._navController.present(toast);
  }



  editing_finished():void{

    console.log("editing finished");

    if(this._text.length<1){
      this._text = this._rememberValue;

      console.log("but not updating, input empty");
    }
    else if(this._rememberValue.trim() == this._text.trim()){
      console.log("but not updating, no changes have been made");
    }
    else {

        this._update_booking();
    }
    this._is_edit_mode = false;
  }



  public editing_should_begin (): void{

    this._rememberValue = this._text;
    this._is_edit_mode = true;

  }


}


/**
 * Created by morit on 29.07.2016.
 */
