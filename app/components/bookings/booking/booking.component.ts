import {Component, Input, Output} from '@angular/core';
import {Response} from "@angular/http";
import {EventEmitter} from "@angular/common/src/facade/async";

import {Alert, NavController, Toast} from "ionic-angular/index";

import {TranslatePipe, TranslateService} from 'ng2-translate/ng2-translate';

import Moment = moment.Moment;
import moment = require("moment/moment");

import {Translations} from '../../../multilanguage/translations';

import {WorkdaysToHoursPipe} from '../../../pipes/workdays-to-hours.pipe';

import {Booking, BookingSession} from '../../../models/booking/booking';

import {BookingService} from "../../../services/bookings/booking.service";

import {EditLabelComponent, RevertableChange} from "../../edit/edit-label.component";
import {CreateBookingComponent} from "../create/create-booking.component";

@Component({
  selector: 'booking',
  directives: [EditLabelComponent],
  templateUrl: 'build/components/bookings/booking/booking.component.html',
  pipes: [WorkdaysToHoursPipe, TranslatePipe]
})

export class BookingComponent {
  private _pickedEffort: string;
  // undefined until user has changed effort
  private _bookingEffort: number;

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
    private _nav: NavController,
    private _translateService: TranslateService
  ) {}

  private _changedEffortLabel(): void {
    this._bookingEffort = this._momentEffortToWorkdays(this._pickedEffort.toString());
    this.booking.effort = this._bookingEffort;
    this._bookingService.update(this.booking).subscribe(
      () => this._showToast(this._translateService.instant(Translations.BOOKING_UPDATE_SUCCESS)),
      () => this._showToast(this._translateService.instant(Translations.BOOKING_UPDATE_ERROR))
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
    this._nav.push(CreateBookingComponent, {
      workpackage: this.bookingSession.workpackage, bookingSession: this.bookingSession
    });
  }

  private _presentDeleteConfirm(booking: Booking): void {
    let alert = Alert.create({
      title: this._translateService.instant(Translations.BOOKING_DELETE_DIALOG),
      message: booking.description + " (" + new WorkdaysToHoursPipe().transform(booking.effort) + ")",
      buttons: [{
        text: this._translateService.instant(Translations.CANCEL), role: 'cancel', handler: () => {
        }
      }, {
        text: this._translateService.instant(Translations.DELETE), handler: () => {
          this._bookingService.delete(this.booking).subscribe(
            () => {
              this._showToast(this._translateService.instant(Translations.BOOKING_DELETE_SUCCESS));
              this.deletedBooking.emit(this.booking);
            }, () => this._translateService.instant(Translations.BOOKING_DELETE_ERROR)
          );
        }
      }]
    });
    this._nav.present(alert);
  }

  private _updateBooking(bookingDescriptionChange: RevertableChange<string>): void {
    this.booking.description = bookingDescriptionChange.getChange();

    this._bookingService.update(this.booking).subscribe(() => {
      this._showToast(this._translateService.instant(Translations.BOOKING_UPDATE_SUCCESS));
    }, () => {
      bookingDescriptionChange.revert();
      this._showToast(this._translateService.instant(Translations.BOOKING_UPDATE_ERROR));
    });
  }

  private _showToast(msg: string) {
    let toast = Toast.create({
      message: msg,
      duration: 1800,
      position: 'bottom'
    });
    this._nav.present(toast);
  }
}


