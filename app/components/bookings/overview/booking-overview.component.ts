
import {Component} from '@angular/core';
import {NavController, DateTime} from "ionic-angular/index";
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
  /*providers: [BookingSessionService]*/
})
export class BookingOverviewComponent {

  private _bookings: Array<Booking>;
  private _bokingSession: BookingSession;
  public pickedDate: Moment = moment('2016-07-30');
  private _pickedDateString: String = "";

  hintMsg :String = "";

  constructor( private _bookingService: BookingService,
               private _navController: NavController,
               private _bookingSessionService: BookingSessionService,
               private _sessionService: SessionService
   ) {

      this._pickedDateString = this.pickedDate.format('YYYY-MM-DD');
      this._loadBookings();
      this._loadBookingSession();
      this._sessionService.onProjectSelected.subscribe(() => this._loadBookings());

  }


  private _loadBookings(): void {

    console.log(this.pickedDate);
    this._bookingService.get(/*moment(this.pickedDate.toString()*/moment('2016-07-31'), null).subscribe((bookings: Array<Booking>) => {
      this._bookings = bookings;

      if(this._bookings.length > 1)
      console.log(" first fetched booking date : " + this._bookings[0].date.format('YYYY-MM-DD'));

      if(this._bookings.length < 1){
        this.hintMsg = "Keine Buchungen an diesem Datum";
      }
      else{
        this.hintMsg ="";
      }
    });
  }


  private _loadBookingSession(): void {
    this._bookingSessionService.retrieve().subscribe((bookingSession: BookingSession) => {

      this._bokingSession = bookingSession;
      console.log(bookingSession.workpackage.name + "  sessionstart: " );

    });

  }



  public dateChanged(): void {
    this._pickedDateString = this.pickedDate.toString();// format('YYYY-MM-DD');
    this._loadBookings();
  }


  public add(): void {
    this._navController.push(WorkpackageSelectionComponent);
  }



}
