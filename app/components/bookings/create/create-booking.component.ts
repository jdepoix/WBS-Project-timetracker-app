import {Component} from '@angular/core';
import {Workpackage} from "../../../models/workpackage/workpackage";
import {NavParams, NavController, Alert} from "ionic-angular/index";
import {BookingService} from "../../../services/bookings/booking.service";
import {AbstractControl, ControlGroup, FormBuilder, Validators} from "@angular/common";
import moment = require("moment/moment");
import {BookingSessionService} from "../../../services/bookings/booking-session.service";
import {BookingSession, Booking} from "../../../models/booking/booking";
import Moment = moment.Moment;
import {Response} from "@angular/http";

@Component({
  templateUrl: 'build/components/bookings/create/create-booking.component.html'
})
export class CreateBookingComponent {
  private _workpackage: Workpackage;
  private _bookingSession: BookingSession;
  effort : AbstractControl;
  description: AbstractControl;
  date: AbstractControl;
  newEtc: AbstractControl;
  authForm: ControlGroup;
  myDate = moment().startOf('day').format('YYYY-MM-DD');
  myEffort = moment().startOf('day').format('HH:mm');
  myEtc: number;

  constructor(navParams: NavParams,
              private _bookingsService: BookingService,
              private _bookingSessionService: BookingSessionService,
              private _fb: FormBuilder,
              private _nav: NavController) {

    this._workpackage = navParams.get('workpackage');
    this._bookingSession = navParams.get('bookingSession');

    if(this._bookingSession) {
      this.myEffort = this._calcEffortForSession(this._bookingSession.startTime, moment().unix());
      this.refreshEtc();
    }

    this.authForm = _fb.group({
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
    if (this._checkFieldsSet()) {
      var booking: Booking = new Booking();
      booking.date = moment(this.date.value);
      booking.description = this.description.value;
      booking.effort = this._stringToWorkday(this.effort.value);
      booking.workpackage = this._workpackage;
      this._bookingsService.create(booking, this.myEtc).subscribe((returnedBooking: Booking) => {
        let alert = Alert.create({
          title: 'Buchung',
          subTitle: 'Buchung erfolgreich!',
          buttons: ['OK']
        });
        this._nav.present(alert);
      });
    }
  }

  private _checkFieldsSet(): boolean {
    return this.authForm.value.description != '';
  }

  createBookingSession(): void {
    this._bookingSession = new BookingSession();
    this.myEffort = moment().hours(0).minutes(0).format('HH:mm');
    this._bookingSession.startTime = moment().unix();
    this._bookingSession.workpackage = this._workpackage;
    this._bookingSessionService.create(this._bookingSession).subscribe((returnedBookingSession: BookingSession) => {
      this._bookingSessionService.retrieve().subscribe((bookingSession: BookingSession) => {
        this._bookingSession = bookingSession;
      });
    });
  }

  checkoutBookingSession(): void {
    if (this._checkFieldsSet()) {
      var booking: Booking = new Booking();
      booking.date = moment(this.date.value);
      booking.description = this.description.value;
      booking.effort = this._stringToWorkday(this.effort.value);
      booking.workpackage = this._workpackage;
      this._bookingsService.create(booking).subscribe((returnedBooking: Booking) => {
        this._bookingSessionService.delete(this._bookingSession).subscribe((response: Response) => {
          if(response['ok']) {
            let alert = Alert.create({
              title: 'Live Buchung',
              subTitle: 'Live Buchung erfolgreich!',
              buttons: ['OK']
            });
            this._bookingSession = null;
            this._nav.present(alert);
          }
        });
      });
    }
  }

  private _stringToWorkday(effort: string): number {
    let timeStrings = effort.split(':');
    let hoursPerDay = parseInt(timeStrings[0])/8;
    let minutesPerDay = (parseInt(timeStrings[1])/60) /8;
    return hoursPerDay+minutesPerDay;
  }

  private _calcEffortForSession(start: number, end: number): string {
    let startMoment = moment(start);
    let endMoment = moment(end);
    let hours = endMoment.diff(startMoment, 'hours');
    let minutes = (endMoment.diff(startMoment, 'minutes'))%60;
    let effortMoment = moment().hours(hours).minutes(minutes);
    return effortMoment.format('HH mm');
  }

  refreshEtc(): void {
    this.myEtc = this._workpackage.etc - this._stringToWorkday(this.effort.value);
  }
}
