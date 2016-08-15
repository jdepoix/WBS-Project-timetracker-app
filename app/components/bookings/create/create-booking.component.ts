import {Component} from '@angular/core';
import {Response} from "@angular/http";
import {AbstractControl, ControlGroup, FormBuilder, Validators} from "@angular/common";

import {NavParams, NavController, Toast} from "ionic-angular/index";

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import moment = require("moment/moment");
import Moment = moment.Moment;

import {Translations} from "../../../multilanguage/translations";

import {Workpackage} from "../../../models/workpackage/workpackage";
import {BookingSession, Booking} from "../../../models/booking/booking";

import {BookingService} from "../../../services/bookings/booking.service";
import {BookingSessionService} from "../../../services/bookings/booking-session.service";

import {BookingOverviewComponent} from "../overview/booking-overview.component";

@Component({
  templateUrl: 'build/components/bookings/create/create-booking.component.html',
  pipes: [TranslatePipe]
})
export class CreateBookingComponent {
  private _workpackage: Workpackage;
  private _bookingSession: BookingSession;
  private _effortControl : AbstractControl;
  private _descriptionControl: AbstractControl;
  private _dateControl: AbstractControl;
  private _newEtcControl: AbstractControl;
  private _authForm: ControlGroup;
  private _translations: typeof Translations = Translations;
  private _maxDate = moment().startOf('day').format('YYYY-MM-DD');
  private _date = moment().startOf('day').format('YYYY-MM-DD');
  private _effort = moment().startOf('day').format('HH:mm');
  private _newEtc: number;
  private _hideLiveBookingButton: boolean;

  constructor(navParams: NavParams,
              private _bookingsService: BookingService,
              private _bookingSessionService: BookingSessionService,
              private _formBuilder: FormBuilder,
              private _navController: NavController,
              private _translate: TranslateService) {

    this._loadHideLiveBooking();
    this._workpackage = navParams.get('workpackage');
    this._bookingSession = navParams.get('bookingSession');

    this._authForm = _formBuilder.group({
      '_descriptionControl': ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      '_dateControl': ['', Validators.required],
      '_effortControl': ['', Validators.required],
      '_newEtcControl': ['', Validators.required]
    });

    this._newEtcControl = this._authForm.controls['_newEtcControl'];
    this._effortControl = this._authForm.controls['_effortControl'];
    this._descriptionControl = this._authForm.controls['_descriptionControl'];
    this._dateControl = this._authForm.controls['_dateControl'];
    this._newEtc = this._workpackage.etc;

    if(this._bookingSession) {
      this._date = moment(this._bookingSession.startTime * 1000).startOf('day').format('YYYY-MM-DD');
      this._calcEffortForSession(this._bookingSession.startTime * 1000);
      this._refreshEtc();
    }
  }

  private _onSubmit() {
    if (this._checkFieldsSet()) {
      let booking: Booking = new Booking();
      booking.date = moment(this._dateControl.value);
      booking.description = this._descriptionControl.value;
      booking.effort = this._stringToWorkday(this._effortControl.value);
      booking.workpackage = this._workpackage;
      this._bookingsService.create(booking, this._newEtc.valueOf()).subscribe((booking: Booking) => {
        if(this._bookingSession) {
          //if there is a bookingsession, delete it when the booking was successful and show Toast
          this._bookingSessionService.delete(this._bookingSession).subscribe((response: Response) => {
            if(response['ok']) {
              this._showToast(this._translate.instant(this._translations.BOOKING_CREATE_LIVEBOOKING_NOTIFY));
            } else {
              this._showToast(this._translate.instant(this._translations.BOOKING_CREATE_LIVEBOOKING_ERROR));
            }
            this._navigateToBookingOverview();
          });
        } else {
          //if the booking was successful (without session) show Toast
          this._showToast(this._translate.instant(this._translations.BOOKING_CREATE_NOTIFY));
          this._navigateToBookingOverview();
        }
      },
        error => {
          this._showToast(this._translate.instant(this._translations.BOOKING_CREATE_ERROR));
        }
      );
    }
  }

  private _createBookingSession(): void {
    let newBookingSession: BookingSession = new BookingSession();
    newBookingSession.workpackage = this._workpackage;

    this._bookingSessionService.create(newBookingSession).subscribe(() => {
      this._showToast(this._translate.instant(this._translations.BOOKING_CREATE_LIVEBOOKING_STARTED));
      this._navigateToBookingOverview();
    });
  }

  private _refreshEtc(): void {
    this._newEtc = this._workpackage.etc - this._stringToWorkday(this._effort);
  }

  private _checkFieldsSet(): boolean {
    return  (this._authForm.value._descriptionControl != '' &&
            !isNaN(Number(this._newEtc))) &&
            Number(this._newEtc) >= 0;
  }

  private _stringToWorkday(_effortControl: string): number {
    let timeStrings: Array<string> = _effortControl.split(':');
    let hoursPerDay: number = parseInt(timeStrings[0])/8;
    let minutesPerDay: number = (parseInt(timeStrings[1])/60) /8;
    return hoursPerDay + minutesPerDay;
  }

  private _calcEffortForSession(start: number):void  {
    let startMoment: Moment = moment(start).utc();
    let now: Moment = moment().utc();
    let hours: number = now.diff(startMoment, 'hours');
    let minutes: number = (now.diff(startMoment, 'minutes'))%60;
    let effortMoment: Moment = now.hours(hours).minutes(minutes);
    this._effort = effortMoment.format('HH:mm');
  }

  private _showToast(msg: string): void {
    let toast: Toast = Toast.create({
      message: msg,
      duration: 1800,
      position: 'bottom'
    });
    this._navController.present(toast);
  }

  private _loadHideLiveBooking(): void {
    this._hideLiveBookingButton = true;
    this._bookingSessionService.retrieve().subscribe((bookingSession:BookingSession) => {
      if(bookingSession) {
        this._hideLiveBookingButton = false;
      }
    });
  }

  private _navigateToBookingOverview(): void {
    this._navController.setRoot(BookingOverviewComponent);
  }
}
