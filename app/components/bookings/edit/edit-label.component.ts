import {Component, Input, Output} from '@angular/core';
import {IONIC_DIRECTIVES, NavController, Toast} from "ionic-angular/index";
import {Booking} from "../../../models/booking/booking";
import {HoursToWorkdaysPipe} from "../../../pipes/hours-to-workdays.pipe";
import {BookingService} from "../../../services/bookings/booking.service";
import {EventEmitter} from "@angular/common/src/facade/async";

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
  @Output()
  public updateBooking = new EventEmitter<string>();

  constructor() {
  }

  public focus():void{
    // this Method is just here for the case that this Editlabel should be triggered
    // by a click instead of a longclick in the future
  }

  private _editingFinished():void{

    if(this.text.length < 1){
      this.text = this._rememberValue;
    }
    else if(this._rememberValue.trim() == this.text.trim()){
      // nothing to change
    }
    else {
        this.updateBooking.emit(this.text.toString());
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
