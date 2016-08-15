import {Component, Input, Output} from '@angular/core';
import {Booking, BookingSession} from '../../../models/booking/booking';
import {WorkdaysToHoursPipe} from '../../../pipes/workdays-to-hours.pipe';
import {Alert, NavController, Toast} from "ionic-angular/index";
import {EditLabelComponent, RevertableChange} from "../../edit/edit-label.component";
import Moment = moment.Moment;
import moment = require("moment/moment");
import {BookingService} from "../../../services/bookings/booking.service";
import {Response} from "@angular/http";
import {CreateBookingComponent} from "../create/create-booking.component";
import {EventEmitter} from "@angular/common/src/facade/async";

@Component({
  selector: 'booking',
  directives: [EditLabelComponent],
  templateUrl: 'build/components/bookings/booking/booking.component.html',
  pipes: [WorkdaysToHoursPipe]
})

export class BookingComponent {
  // Moment object, but behaves like a String("HH:mm") after set by DateTimePicker via Gui
  private _pickedEffort: Moment = moment(new Date().getTime());
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

  constructor(private _bookingService: BookingService, private _nav: NavController) {
  }

  private _changedEffortLabel(): void {
    this._bookingEffort = this._momentEffortToWorkdays(this._pickedEffort.toString());
    this.booking.effort = this._bookingEffort;
    this._bookingService.update(this.booking).subscribe((returnedBooking: Booking) => {
      if (returnedBooking)
        this._showToast("Effort has been updated to " + this._pickedEffort.toString());
    });
  }

  private _momentEffortToWorkdays(mom: string): number {
    return +(mom.split(":")[0]) / 8 + +(mom.split(":")[1]) / 60 / 8;
  }

  private _deleteSelf(): void {
    this._presentDeleteConfirm(this.booking);
  }

  private _timeStampToDuration(stamp: number): string {
    let start = new Date(stamp * 1000);
    let until = new Date();
    let d = until.getDay() - start.getDay();
    let h = until.getHours() - start.getHours();
    let mins = until.getMinutes() - start.getMinutes();
    if (d > 0) {
      h = h + 24 * d;
    }
    let formattedTime = h + ' h ' + mins + ' min';
    return formattedTime;
  }

  private _checkoutLivebooking(): void {
    this._nav.push(CreateBookingComponent, {
      workpackage: this.bookingSession.workpackage, bookingSession: this.bookingSession
    });
  }

  private _presentDeleteConfirm(booking: Booking): void {
    let alert = Alert.create({
      title: 'Delete Booking?',
      message: booking.description + " (" + new WorkdaysToHoursPipe().transform(booking.effort) + ")",
      buttons: [{
        text: 'Cancel', role: 'cancel', handler: () => {
        }
      }, {
        text: 'Delete', handler: () => {
          this._bookingService.delete(this.booking).subscribe((returnedDeleteResponse: Response) => {
            if (returnedDeleteResponse.status == 204) {
              this._showToast("Deleted Booking");
              this.deletedBooking.emit(this.booking);
            }
          });
        }
      }]
    });
    this._nav.present(alert);
  }

  private _updateBooking(bookingDescriptionChange: RevertableChange<string>): void {
    this.booking.description = bookingDescriptionChange.getChange();

    this._bookingService.update(this.booking).subscribe(() => {
      this._showToast("updated booking decription");
    }, () => {
      bookingDescriptionChange.revert();
      this._showToast("something went wrong");
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


