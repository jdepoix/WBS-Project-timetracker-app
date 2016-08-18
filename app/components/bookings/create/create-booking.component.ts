import {Component} from '@angular/core';
import {Response} from "@angular/http";

import {AbstractControl, FormGroup, FormBuilder, Validators} from "@angular/forms";

import {NavParams, NavController} from "ionic-angular/index";

import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";

import moment = require("moment/moment");
import Moment = moment.Moment;

import {TimestampUtils} from '../../../core/datetime/timestamp';

import {Translations} from "../../../multilanguage/translations";

import {Workpackage} from "../../../models/workpackage/workpackage";
import {BookingSession, Booking} from "../../../models/booking/booking";

import {ToastService} from '../../../services/toasts/toast.service';
import {BookingService} from "../../../services/bookings/booking.service";
import {BookingSessionService} from "../../../services/bookings/booking-session.service";

import {BookingOverviewComponent} from "../overview/booking-overview.component";
import {WorkdaysToHoursPipe} from "../../../pipes/workdays-to-hours.pipe";
import {HoursToWorkdaysPipe} from "../../../pipes/hours-to-workdays.pipe";

@Component({
  templateUrl: 'build/components/bookings/create/create-booking.component.html',
  pipes: [TranslatePipe, HoursToWorkdaysPipe, WorkdaysToHoursPipe]
})
export class CreateBookingComponent {
  private _workpackage: Workpackage;
  private _bookingSession: BookingSession;
  private _effortControl : AbstractControl;
  private _descriptionControl: AbstractControl;
  private _dateControl: AbstractControl;
  private _newEtcControl: AbstractControl;
  private _authForm: FormGroup;
  private _translations: typeof Translations = Translations;
  private _maxDate: string = moment().startOf('day').format('YYYY-MM-DD');
  private _date: string = moment().startOf('day').format('YYYY-MM-DD');
  private _effort: string = moment().startOf('day').format('HH:mm');
  private _newEtc: string;
  private _hideLiveBookingButton: boolean;

  constructor(navParams: NavParams,
              private _bookingsService: BookingService,
              private _bookingSessionService: BookingSessionService,
              private _formBuilder: FormBuilder,
              private _navController: NavController,
              private _toastService: ToastService,
              private _translateService: TranslateService) {

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
    this._newEtc = this._workdayToString(this._workpackage.etc);

    if(this._bookingSession) {
      this._date = moment.unix(this._bookingSession.startTime).startOf('day').format('YYYY-MM-DD');
      this._calcEffortForSession(this._bookingSession.startTime);
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
      this._bookingsService.create(booking, this._stringToWorkday(this._newEtc)).subscribe((booking: Booking) => {
        if(this._bookingSession) {
          //if there is a bookingsession, delete it when the booking was successful and show Toast
          this._bookingSessionService.delete(this._bookingSession).subscribe((response: Response) => {
            if(response['ok']) {
              this._toastService.showToast(
                this._translateService.instant(this._translations.BOOKING_CREATE_LIVEBOOKING_NOTIFY)
              );
            } else {
              this._toastService.showToast(
                this._translateService.instant(this._translations.BOOKING_CREATE_LIVEBOOKING_ERROR)
              );
            }
            this._navigateToBookingOverview();
          });
        } else {
          //if the booking was successful (without session) show Toast
          this._toastService.showToast(
            this._translateService.instant(this._translations.BOOKING_CREATE_NOTIFY)
          );
          this._navigateToBookingOverview();
        }
      },
        error => {
          this._toastService.showToast(this._translateService.instant(this._translations.BOOKING_CREATE_ERROR));
        }
      );
    }
  }

  private _createBookingSession(): void {
    let newBookingSession: BookingSession = new BookingSession();
    newBookingSession.workpackage = this._workpackage;

    this._bookingSessionService.create(newBookingSession).subscribe(() => {
      this._toastService.showToast(this._translateService.instant(this._translations.BOOKING_CREATE_LIVEBOOKING_STARTED));
      this._navigateToBookingOverview();
    });
  }

  private _refreshEtc(): void {
    if(this._checkEtc()) {
      let newEtc = this._workpackage.etc - this._stringToWorkday(this._effort);
      if(newEtc < 0) {
        this._toastService.showToast(this._translateService.instant(this._translations.BOOKING_CREATE_NEWETC_ERROR));
      } else {
        this._newEtc = this._workdayToString(newEtc);
      }
    }
  }

  private _checkFieldsSet(): boolean {
    if(!this._checkEtc()) {
      this._toastService.showToast(this._translateService.instant(this._translations.BOOKING_CREATE_NEWETC_ERROR));
      return false;
    }
    return this._authForm.value._descriptionControl != '';
  }

  private _stringToWorkday(effort: string): number {
    let timeStrings: Array<string> = effort.split(':');
    let hoursPerDay: number = parseInt(timeStrings[0])/8;
    let minutesPerDay: number = (parseInt(timeStrings[1])/60) /8;
    return hoursPerDay + minutesPerDay;
  }

  private _calcEffortForSession(timestamp: number): void {
    this._effort = TimestampUtils.getTimestampLifetime(timestamp).toString();
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

  private _workdayToString(workdays: number): string {
    let workdaysInHours: number = workdays * 8;
    let hours: number = parseInt(workdaysInHours.toString());
    let minutesString: string = parseInt((Math.abs(workdaysInHours - hours) * 60).toString()).toString();

    while (minutesString.length < 2) {
      minutesString = '0' + minutesString;
    }
    return hours.toString() + ':' + minutesString;
  }

  private _checkEtc(): boolean {
    let newEtc = this._stringToWorkday(this._newEtc);
    if(isNaN(newEtc)) {
      return false;
    }
    let regex = /[0-9]+:[0-5][0-9]/;
    return regex.test(this._newEtc);
  }
}
