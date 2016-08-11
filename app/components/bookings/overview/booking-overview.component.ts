
import {Component} from '@angular/core';
import {NavController} from "ionic-angular/index";
import {BookingComponent} from "../../../components/bookings/booking/booking.component";
import {SessionService} from "../../../services/session/session.service";
import {WorkpackageSelectionComponent} from "../workpackage-selection/booking-workpackage-selection.component";
import {BookingService} from "../../../services/bookings/booking.service";
import {Booking, BookingSession} from "../../../models/booking/booking";
import {BookingSessionService} from "../../../services/bookings/booking-session.service";
import moment = require("moment/moment");
import Moment = moment.Moment;

@Component({
  templateUrl: 'build/components/bookings/overview/booking-overview.component.html',
  directives: [BookingComponent],

})
export class BookingOverviewComponent {

  private _bookings: Array<Booking>;
  private _bokingSession: BookingSession;
  private _pickedDate: Moment = moment(new Date());
  private _pickedDateString: String = "";

  private _hintMsg :String = "";

  constructor( private _bookingService: BookingService,
               private _navController: NavController,
               private _bookingSessionService: BookingSessionService,
               private _sessionService: SessionService
   ) {
      this._pickedDateString = this._pickedDate.format('DD.MM.YYYY');
      this._loadBookings();
      this._loadBookingSession();
      this._sessionService.onProjectSelected.subscribe(() => this._loadBookings());
  }


  private _loadBookings(): void {

    /*
    TODO: first param is supposed to be moment, not null
    * */
    this._bookingService.get(/*moment(this.pickedDate.toString()*/null, null).subscribe((bookings: Array<Booking>) => {
      this._bookings = bookings;
    });
  }


  private _loadBookingSession(): void {

    this._bookingSessionService.retrieve().subscribe((bookingSession: BookingSession) => {
     if(bookingSession != null){
       this._bokingSession = bookingSession;
       this._hintMsg = "";
     }else if(this._bookings.length < 1) // no bookings an no live booking sessions
      {
        this._hintMsg = "Keine Buchungen an diesem Datum";
      }else{
        this._hintMsg ="";
      }
    });
  }


  private _dateChanged(): void {
    this._pickedDateString = moment(this._pickedDate).format("DD.MM.YYYY");// format('YYYY-MM-DD');
    this._loadBookings();
  }


  private _add(): void {
    this._navController.push(WorkpackageSelectionComponent);
  }


  // Delete one Booking out of local List after child component (booking.component) emitted Event
  private _deletedBooking(b: Booking){

     var index = this._bookings.indexOf(b, 0);
     if (index > -1) {
       this._bookings.splice(index, 1);
     }
  }

}
