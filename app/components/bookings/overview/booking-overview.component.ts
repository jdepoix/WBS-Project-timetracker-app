import {Component} from '@angular/core';

import {NavController} from "ionic-angular/index";

import {TranslatePipe} from 'ng2-translate/ng2-translate';

import moment = require("moment/moment");
import Moment = moment.Moment;

import {Translations} from '../../../multilanguage/translations';

import {Booking, BookingSession} from "../../../models/booking/booking";

import {SessionService} from "../../../services/session/session.service";
import {ToastService} from '../../../services/toasts/toast.service';
import {BookingService} from "../../../services/bookings/booking.service";
import {BookingSessionService} from "../../../services/bookings/booking-session.service";

import {BookingComponent} from "../../../components/bookings/booking/booking.component";
import {
  WorkpackageOverviewComponent, WorkpackageOverviewContext
} from "../../workpackages/overview/workpackage-overview.component";

@Component({
  templateUrl: 'build/components/bookings/overview/booking-overview.component.html',
  directives: [BookingComponent],
  pipes: [TranslatePipe]
})
export class BookingOverviewComponent {
  private _translations: typeof Translations = Translations;
  private _pickedDate: string = moment().format("YYYY-MM-DD");
  private _bookings: Array<Booking> = null;
  private _bookingSession: BookingSession;
  private _pickedDateString: string = "";

  constructor(
    private _bookingService: BookingService,
    private _navController: NavController,
    private _bookingSessionService: BookingSessionService,
    private _sessionService: SessionService,
    private _toastService: ToastService
  ) {
    this._pickedDateString = moment(this._pickedDate).format("DD.MM.YYYY");
    this._loadBookingSession();

    if (this._sessionService.selectedProject != null) {
      this._loadBookings();
    }

    this._sessionService.onProjectSelected.subscribe(() => this._loadBookings());
  }

  private _loadBookings(): void {
    this._bookingService.get(moment(this._pickedDate), null).subscribe((bookings: Array<Booking>) => {
      this._bookings = bookings;
    });
  }

  private _loadBookingSession(): void {
    this._bookingSessionService.retrieve().subscribe((bookingSession: BookingSession) => {
      this._bookingSession = bookingSession;
    });
  }

  private _dateChanged(): void {
    this._loadBookings();
  }

  private _add(): void {
    this._navController.push(WorkpackageOverviewComponent, {
      context: WorkpackageOverviewContext.BOOKING_WORKPACKAGE_SELECTION
    });
  }

  // Delete one Booking out of local List after child component (booking.component) emitted Event
  private _deletedBooking(booking: Booking) {
    let index = this._bookings.indexOf(booking, 0);
    if (index > -1) {
      this._bookings.splice(index, 1);
    }
  }
}
