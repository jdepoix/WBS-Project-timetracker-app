import {Component} from '@angular/core';
import {Workpackage} from "../../../models/workpackage/workpackage";
import {NavParams, NavController, Toast} from "ionic-angular/index";
import {BookingService} from "../../../services/bookings/booking.service";
import {AbstractControl, ControlGroup, FormBuilder, Validators} from "@angular/common";
import moment = require("moment/moment");
import {BookingSessionService} from "../../../services/bookings/booking-session.service";
import {BookingSession, Booking} from "../../../models/booking/booking";
import Moment = moment.Moment;
import {Response} from "@angular/http";
import {BookingOverviewComponent} from "../overview/booking-overview.component";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Translations} from "../../../multilanguage/translations";

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
  private _etc: number;
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
      '_effortControl': ['', Validators.required]
    });

    this._newEtcControl = this._authForm.controls['_newEtcControl'];
    this._effortControl = this._authForm.controls['_effortControl'];
    this._descriptionControl = this._authForm.controls['_descriptionControl'];
    this._dateControl = this._authForm.controls['_dateControl'];
    this._etc = this._workpackage.etc;

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
      this._bookingsService.create(booking, this._etc).subscribe((booking: Booking) => {
        if(this._bookingSession) {
          //if there is a bookingsession, delete it when the booking was successful and show Toast
          this._bookingSessionService.delete(this._bookingSession).subscribe((response: Response) => {
            if(response['ok']) {
              this._showToast(this._translate.instant(this._translations.BOOKING_CREATE_LIVEBOOKING_NOTIFY));
            } else {
              this._showToast(this._translate.instant(this._translations.BOOKING_CREATE_LIVEBOOKING_ERROR));
            }
          });
          this._navigateToBookingOverview();
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
    this._bookingSession = new BookingSession();
    this._effort = moment().hours(0).minutes(0).format('HH:mm');
    this._bookingSession.workpackage = this._workpackage;
    this._bookingSessionService.create(this._bookingSession).subscribe((bookingSession: BookingSession) => {
      this._bookingSession = bookingSession;
      this._showToast(this._translate.instant(this._translations.BOOKING_CREATE_LIVEBOOKING_STARTED));
      this._navigateToBookingOverview();
    });

  }

  private _refreshEtc(): void {
    this._etc = this._workpackage.etc - this._stringToWorkday(this._effort);
  }

  private _checkFieldsSet(): boolean {
    return  this._authForm.value._descriptionControl != '';
  }

  private _stringToWorkday(_effortControl: string): number {
    let timeStrings = _effortControl.split(':');
    let hoursPerDay = parseInt(timeStrings[0])/8;
    let minutesPerDay = (parseInt(timeStrings[1])/60) /8;
    return hoursPerDay+minutesPerDay;
  }

  private _calcEffortForSession(start: number):void  {
    let startMoment = moment(start);
    let hours = moment().diff(startMoment, 'hours')-2;
    let minutes = (moment().diff(startMoment, 'minutes'))%60;
    let effortMoment = moment().hours(hours).minutes(minutes);
    this._effort = effortMoment.format('HH:mm');
  }

  private _showToast(msg: string): void {
    let toast = Toast.create({
      message: msg,
      duration: 1800,
      position: 'bottom'
    });
    toast.onDismiss(() => {});
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
