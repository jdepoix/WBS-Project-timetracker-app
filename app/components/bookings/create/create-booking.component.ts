import {Component} from '@angular/core';
import {Workpackage} from "../../../models/workpackage/workpackage";
import {NavParams, Loading, NavController, Alert} from "ionic-angular/index";
import {BookingService} from "../../../services/bookings/booking.service";
import {AbstractControl, ControlGroup, FormBuilder, Validators} from "@angular/common";
import moment = require("moment/moment");
import {BookingSessionService} from "../../../services/bookings/booking-session.service";
import {BookingSession, Booking} from "../../../models/booking/booking";
import Moment = moment.Moment;

@Component({
  templateUrl: 'build/components/bookings/create/create-booking.component.html'
})
export class CreateBookingComponent {
  private _workpackage: Workpackage;
  effort : AbstractControl;
  description: AbstractControl;
  date: AbstractControl;
  newEtc: AbstractControl;
  authForm: ControlGroup;
  //minuteValues: Array<Number>=[0,5,10,15,20,25,30,35,40,45,50,55];
  maxDate = moment.utc().startOf('day').format('YYYY-MM-DD');
  myEtc: number;

  constructor(navParams: NavParams,
              private _bookingsService: BookingService,
              private _bookingSessionService: BookingSessionService,
              private fb: FormBuilder,
              private nav: NavController) {


    this._workpackage = navParams.get('workpackage');
    this.authForm = fb.group({
      'description': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      'date': ['', Validators.required],
      'effort': ['', Validators.required]
    });

    this.newEtc = this.authForm.controls['newEtc'];
    this.effort = this.authForm.controls['effort'];
    this.description = this.authForm.controls['description'];
    this.date = this.authForm.controls['date'];
    this.myEtc = this._workpackage.etc;
  }

  onSubmit() {
    if (this.checkFieldsSet()) {
      var booking: Booking = new Booking();
      booking.date = moment(this.date.value);
      booking.description = this.description.value;
      booking.effort = this._stringToWorkday(this.effort.value);
      booking.workpackage = this._workpackage;
      this._bookingsService.create(booking).subscribe((returnedBooking: Booking) => {
      });
    }
  }

  checkFieldsSet(): boolean {
    return this.authForm.value.description != '' &&
          typeof this.effort.value != 'undefined';
  }

  createBookingSession(): void {
    var bookingSession: BookingSession = new BookingSession();
    bookingSession.startTime = moment.utc().date();
    bookingSession.workpackage = this._workpackage;
    this._bookingSessionService.create(bookingSession).subscribe((returnedBookingSession: BookingSession) => {
    });
  }

  private _stringToWorkday(effort: string): number {
    let timeStrings = effort.split(':');
    let hoursPerDay = parseInt(timeStrings[0])/8;
    let minutesPerDay = (parseInt(timeStrings[1])/60) /8;
    return hoursPerDay+minutesPerDay;
  }

  refreshEtc(): void {
    this.myEtc = this._workpackage.etc - this._stringToWorkday(this.effort.value);
    console.log(this.myEtc);
  }
}
