import {Component, Input, Renderer} from '@angular/core';

import {IONIC_DIRECTIVES} from "ionic-angular/index";
import {Booking} from "../../../models/booking/booking";
import {HoursToWorkdaysPipe} from "../../../pipes/hours-to-workdays.pipe";
import {WorkdaysToHoursPipe} from "../../../pipes/workdays-to-hours.pipe";

@Component({
  selector: 'edit-label',
  directives: [IONIC_DIRECTIVES],
  templateUrl: 'build/components/bookings/edit/edit-label.component.html',
  pipes: [HoursToWorkdaysPipe, WorkdaysToHoursPipe]
})

export class EditLabel {

  private _is_edit_mode: boolean = false;
  private _rememberValue: String= "";

  @Input()
  public _text: String;
  @Input()
  public isTimeLabel: boolean = false;
  @Input()
  public booking: Booking;

  constructor() {


  }


  private hourStringToWorkdays(hourString: String) :number{

    let hrs = hourString.substring(0, hourString.indexOf(":"));
    let mins = hourString.substr(hourString.indexOf(":")+1, hourString.indexOf(" ")-1);

    var res :number =  +hrs / 8 + +mins / 60 / 8;
    console.log(hrs+":"+mins+  "???");
    console.log("res  " + res+ "   =???");
    return res;
  }


  _update_booking ():void{

    console.log("will update Booking :  :  " + this.hourStringToWorkdays(this._text));
    //TODO: all this stuff


  }

  editing_finished():void{

    console.log("edit finished");

    if(this._text.length<1){
      this._text = this._rememberValue;
      this._text = this._text + " h";
      console.log("but not updating, input empty");
    }
    else if(this._rememberValue.trim() == this._text.trim()){
      console.log("but not updating, no changes have been made");
      this._text = this._text + " h";
    }
    else {
      if(this.isTimeLabel){

        if(this._checkTimeLabel()){
          console.log("Test best");
          this._text = this._text + " h";
          this._update_booking();
        }
        else {
          console.log("Test NICHT best");
          this._text = this._rememberValue;
        }


      }
      else {
        this._update_booking();
      }
    }
    this._is_edit_mode = false;
  }


  private _remove_unit(string :String){

    this._text = string.replace(" h", "");
  }


  public editing_should_begin (): void{

    console.log("edit can begin - isTimeLabel ? " + this.isTimeLabel);
    if(this.isTimeLabel){
      this._remove_unit(this._text);
    }
    this._rememberValue = this._text;
    this._is_edit_mode = true;

  }

  public key_up():void{

    if(this.isTimeLabel){

      if(this._text.length>5){
        this._text = this._text.substr(0,5);
      }

    }




  }

  private _checkTimeLabel() : boolean{

    if(!this._text.includes(":")){
      return false;
    }
    if(this._text.length < 3){
      return false;
    }
    for(var i = 0; i < this._text.length; i++){
      if(!this._text.charAt(i).match(new RegExp("^[0-9]*$")) && !(this._text.charAt(i) == ':')){
        return false;
      }
    }
    if(this._text.charAt(0) == ':'){
      return false;
    }
    if(this._text.charAt(0) == '0'){
      this._text = this._text.substr(1);
    }
    if(this._text.charAt(this._text.length-1) == ':'){
      return false;
    }
    var hrs :String = "" + this._text.substring(0, this._text.indexOf(":"));
    var mins:String = "" + this._text.substring(this._text.indexOf(":")+1, this._text.length);
    if(mins.length == 1){
      mins = "0" + mins;
    }
    var n_hrs:number = +hrs;
    var n_mins: number = +mins;

    if(n_hrs> 12 || n_mins > 59){
      return false;
    }
    console.log("EFFORT TIME: " + hrs + ":" + mins);
    this._text = hrs+":"+mins;

    return true;
  }


/*
  clicked(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
*/
}


/**
 * Created by morit on 29.07.2016.
 */
