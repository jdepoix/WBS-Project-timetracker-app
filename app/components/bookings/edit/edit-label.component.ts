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

export class EditLabelComponent {

  private _isEditMode: boolean = false;
  private _rememberValue: String= "";

  @Input()
  public text: String;
  @Input()
  public booking: Booking;

  constructor( private _navController: NavController,
               private _bookingService: BookingService) {
  }

  private _focus():void{
    // this Method is just here for the case that this Editlabel should be triggered
    // by a click instead of a longclick in the future
  }

  private _updateBooking ():void{

    this.booking.description = String(this.text);
    //TODO: test on valid backend istallation

    // once got this error in backend:

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

    this._showToast();
    this._bookingService.update(this.booking).subscribe((returnedBooking: Booking) => {
      //console.log("returned booking after update: " + returnedBooking);
    });
  }


  private _showToast() {
    let toast = Toast.create({
      message: 'Description changed',
      duration: 1500,
      position: 'bottom'
    });
    toast.onDismiss(() => {});
    this._navController.present(toast);
  }


  private _editingFinished():void{

    if(this.text.length<1){
      this.text = this._rememberValue;
    }
    else if(this._rememberValue.trim() == this.text.trim()){
      // nothing to change
    }
    else {
        this._updateBooking();
    }
    this._isEditMode = false;
  }


  private  _editingShouldBegin (): void{
    this._rememberValue = this.text;
    this._isEditMode = true;
  }
}

/**
 * Created by morit on 29.07.2016.
 */
