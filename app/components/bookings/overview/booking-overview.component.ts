import {Component} from '@angular/core';
import {NavController} from "ionic-angular/index";
import {BookingComponent} from "../../../components/bookings/booking/booking.component";
import {SessionService} from "../../../services/session/session.service";
import {BookingService} from "../../../services/bookings/booking.service";
import {Booking, BookingSession} from "../../../models/booking/booking";
import {BookingSessionService} from "../../../services/bookings/booking-session.service";
import moment = require("moment/moment");
import Moment = moment.Moment;
import {
  WorkpackageOverviewComponent,
  WorkpackageOverviewContext
} from "../../workpackages/overview/workpackage-overview.component";

@Component({
  templateUrl: 'build/components/bookings/overview/booking-overview.component.html',
  directives: [BookingComponent],

})
export class BookingOverviewComponent {

  private _bookings:Array<Booking> = [];
  private _bookingSession:BookingSession;
  private _pickedDate:string = moment().format("YYYY-MM-DD");
  private _pickedDateString:string = "";

  constructor(private _bookingService:BookingService,
              private _navController:NavController,
              private _bookingSessionService:BookingSessionService,
              private _sessionService:SessionService) {
    this._pickedDateString = moment(this._pickedDate).format("DD.MM.YYYY");
    this._loadBookingSession();
    this._loadBookings();
    this._sessionService.onProjectSelected.subscribe(() => this._loadBookings());
  }


  private _loadBookings():void {

    this._bookingService.get(moment(this._pickedDate), null).subscribe((bookings:Array<Booking>) => {
      this._bookings = bookings;
      if(bookings.length == 0)
        this._bookings = null;
    });
  }


  private _loadBookingSession():void {

    this._bookingSessionService.retrieve().subscribe((bookingSession:BookingSession) => {
      this._bookingSession = bookingSession;
    });
  }


  private _dateChanged():void {
    this._pickedDateString = moment(this._pickedDate).format("DD.MM.YYYY");// format('YYYY-MM-DD');
    this._loadBookings();
  }


  private _add():void {
    this._navController.push(WorkpackageOverviewComponent, {
      context: WorkpackageOverviewContext.BOOKING_WORKPACKAGE_SELECTION
    });
  }


  // Delete one Booking out of local List after child component (booking.component) emitted Event
  private _deletedBooking(b:Booking) {
    var index = this._bookings.indexOf(b, 0);
    if (index > -1) {
      this._bookings.splice(index, 1);
    }
  }

}
