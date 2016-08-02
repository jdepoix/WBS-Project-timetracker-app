import {Component} from '@angular/core';
import {Workpackage} from "../../../models/workpackage/workpackage";
import {NavParams, Loading, NavController, Alert} from "ionic-angular/index";
import {BookingService} from "../../../services/bookings/booking.service";
import {AbstractControl, ControlGroup, FormBuilder, Validators} from "@angular/common";
import moment = require("moment/moment");
import {BookingSessionService} from "../../../services/bookings/booking-session.service";
import {BookingSession} from "../../../models/booking/booking";

@Component({
  templateUrl: 'build/components/bookings/create/create-booking.component.html'
})
export class CreateBookingComponent {
  private _workpackage: Workpackage;
  effort : AbstractControl;
  description: AbstractControl;
  date: AbstractControl;
  authForm: ControlGroup;
  minuteValues: Array<Number>=[0,5,10,15,20,25,30,35,40,45,50,55];
  maxDate = moment.utc().startOf('day').format('YYYY-MM-DD');
  myDate = this.maxDate.toString();

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

    this.effort = this.authForm.controls['effort'];
    this.description = this.authForm.controls['description'];
    this.date = this.authForm.controls['date'];
  }

  onSubmit() {
    if (this.checkFieldsSet()) {
      let alert = Alert.create({
        title: 'Buchung',
        subTitle: 'Buchung korrekt eingegeben',
        buttons: ['OK']
      });
      this.nav.present(alert);
    }
  }

  checkFieldsSet(): boolean {
    console.log(this.effort.value);
    console.log(this.date.value);
    return this.authForm.value.description != '' &&
          typeof this.effort.value != 'undefined' &&
          typeof this.date.value != 'undefined';
  }

  createBookingSession(): void {
    var bookingSession: BookingSession = new BookingSession();
    bookingSession.startTime = moment.utc().date();
    bookingSession.workpackage = this._workpackage;
    this._bookingSessionService.create(bookingSession).subscribe((returnedBookingSession: BookingSession) => {
    });
  }
}
