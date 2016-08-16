import {Component, Input, Output, OnInit, OnDestroy} from '@angular/core';
import {EventEmitter} from "@angular/common/src/facade/async";

import {AlertController, Alert, NavController, Toast} from 'ionic-angular/index';

import {TranslatePipe, TranslateService} from 'ng2-translate/ng2-translate';

import Moment = moment.Moment;
import moment = require("moment/moment");

import {Translations} from '../../../multilanguage/translations';

import {WorkdaysToHoursPipe} from '../../../pipes/workdays-to-hours.pipe';

import {Booking, BookingSession} from '../../../models/booking/booking';

import {ToastService} from '../../../services/toasts/toast.service';
import {BookingService} from "../../../services/bookings/booking.service";

import {EditLabelComponent, RevertableChange} from "../../edit/edit-label.component";
import {CreateBookingComponent} from "../create/create-booking.component";

@Component({
  selector: 'booking',
  directives: [EditLabelComponent],
  templateUrl: 'build/components/bookings/booking/booking.component.html',
  pipes: [WorkdaysToHoursPipe, TranslatePipe]
})

export class BookingComponent implements OnInit, OnDestroy {

  private _translations: typeof Translations = Translations;
  private _pickedEffort: string;
  // undefined until user has changed effort
  private _bookingEffort: number;

  private _liveBookingRuntime: string = '';

  private _liveBookingIntervallTimerId: number = null;

  /*
   * if this.isLife is true, booking is null
   * otherwise bookingSession will be null
   */

  @Input()
  public withWpName: boolean;

  @Input()
  public booking: Booking;

  @Input()
  public bookingSession: BookingSession;

  @Input()
  public isLive: boolean;

  @Output()
  public deletedBooking = new EventEmitter<Booking>();

  constructor(
    private _bookingService: BookingService,
    private _translateService: TranslateService,
    private _navController: NavController,
    private _toastService: ToastService,
    private _alertController: AlertController
  ) {

  }


  public ngOnInit(): any {
    if (this.bookingSession) {
      this._calulateLiveBookingRuntime();
      this._liveBookingIntervallTimerId = setInterval(() => {
        this._calulateLiveBookingRuntime();
      }, 1000);
    }
    if(!this.isLive)
      this._pickedEffort = this._workdaysEffortToMomentEffort(this.booking.effort);
  }

  public ngOnDestroy(): any {
    if (this._liveBookingIntervallTimerId) {
      clearInterval(this._liveBookingIntervallTimerId);
    }
  }

  private _calulateLiveBookingRuntime(): void {
    this._liveBookingRuntime = this._timeStampToDuration(this.bookingSession.startTime);
  }

  private _changedEffortLabel(): void {
    this._bookingEffort = this._momentEffortToWorkdays(this._pickedEffort.toString());
    this.booking.effort = this._bookingEffort;
    this._bookingService.update(this.booking).subscribe(
      () => this._toastService.showToast(this._translateService.instant(Translations.BOOKING_UPDATE_SUCCESS)),
      () => this._toastService.showToast(this._translateService.instant(Translations.BOOKING_UPDATE_ERROR))
    );
  }

  private _momentEffortToWorkdays(mom: string): number {
    return +(mom.split(":")[0]) / 8 + +(mom.split(":")[1]) / 60 / 8;
  }

  private _deleteSelf(): void {
    this._presentDeleteConfirm(this.booking);
  }

  private _timeStampToDuration(timestamp: number): string {
    let startMoment: Moment = moment.unix(timestamp).utc();
    let now: Moment = moment().utc();
    let hours: number = now.diff(startMoment, 'hours');
    let minutes: number = (now.diff(startMoment, 'minutes'))%60;
    let effortMoment: Moment = now.hours(hours).minutes(minutes);
    return effortMoment.format('HH:mm');
  }

  private _checkoutLivebooking(): void {
    this._navController.push(CreateBookingComponent, {
      workpackage: this.bookingSession.workpackage, bookingSession: this.bookingSession
    });
  }

  private _presentDeleteConfirm(booking: Booking): void {
    let alert: Alert = this._alertController.create({
      title: this._translateService.instant(Translations.BOOKING_DELETE_DIALOG),
      message: booking.description + " (" + new WorkdaysToHoursPipe().transform(booking.effort) + ")",
      buttons: [{
        text: this._translateService.instant(Translations.CANCEL), role: 'cancel', handler: () => {
        }
      }, {
        text: this._translateService.instant(Translations.DELETE), handler: () => {
          this._bookingService.delete(this.booking).subscribe(
            () => {
              this._toastService.showToast(this._translateService.instant(Translations.BOOKING_DELETE_SUCCESS));
              this.deletedBooking.emit(this.booking);
            }, () => this._translateService.instant(Translations.BOOKING_DELETE_ERROR)
          );
        }
      }]
    });

    alert.present();
  }

  private _updateBooking(bookingDescriptionChange: RevertableChange<string>): void {
    this.booking.description = bookingDescriptionChange.getChange();

    this._bookingService.update(this.booking).subscribe(() => {
      this._toastService.showToast(this._translateService.instant(Translations.BOOKING_UPDATE_SUCCESS));
    }, () => {
      bookingDescriptionChange.revert();
      this._toastService.showToast(this._translateService.instant(Translations.BOOKING_UPDATE_ERROR));
    });
  }


  private _showToast(msg: string) {
    let toast: Toast = this._toastController.create({
      message: msg,
      duration: 1800,
      position: 'bottom'
    });

    toast.present();
  }


  /**
   * booking effort in workdays (float, 8 h per day)
   * is transformed to a moment Object to work as a model for the booking effort time picker
   * */
  private _workdaysEffortToMomentEffort(workdays: number): string {
    let workdaysInHours: number = workdays * 8;
    let hours: number = parseInt(workdaysInHours.toString());
    let minutes: number = parseInt((Math.abs(workdaysInHours - hours) * 60).toString());
    let mom:Moment = moment();
    let effortMoment: Moment = mom.hours(hours).minutes(minutes);

    return effortMoment.format('HH:mm');
  }


}


