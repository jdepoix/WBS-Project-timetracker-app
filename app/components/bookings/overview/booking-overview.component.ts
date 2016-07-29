
import {Component} from '@angular/core';
import {NavController} from "ionic-angular/index";

import {Booking} from "../../../models/booking/booking";
import {BookingComponent} from "../../../components/bookings/booking/booking.component";
import {BookingService} from "../../../services/bookings/booking.service";
import {SessionService} from "../../../services/session/session.service";
import {WorkpackageSelectionComponent} from "../workpackage-selection/booking-workpackage-selection.component";




@Component({
  templateUrl: 'build/components/bookings/overview/booking-overview.component.html',
  directives: [BookingComponent],
  /*providers: [BookingSessionService]*/
})
export class BookingOverviewComponent {

  private _bookings: Array<Booking>;
  public pickedDate: Date;
  private _pickedDateString: String = "4545454";

  hintMsg :String = "";

  constructor( private _bookingService: BookingService,
               private _navController: NavController,
               /*private _bookingSessionService: BookingSessionService,*/
               private _sessionService: SessionService
   ) {

      this.pickedDate = new Date();
      this._pickedDateString = this.pickedDate.toDateString();
      this._loadBookings();
      //this._loadBookingSession();
      //this._sessionService.onProjectSelected.subscribe(() => this._loadBookings());

  }



  private _loadBookings(): void {
    this._bookingService.get(new Date(this.pickedDate.toString()), null).subscribe((bookings: Array<Booking>) => {
      this._bookings = bookings;
      if(this._bookings.length < 1){
        this.hintMsg = "Keine Buchungen an diesem Datum";
      }
      else{
        this.hintMsg ="";
      }
    });
  }


  private _loadBookingSession(): void {
   /* this._bookingSessionService.get().subscribe((bookingSession: Array<BookingSession>) => {


      length = bookingSession.length;
      if (length > 0) {

        console.log(bookingSession.pop());

      }
      console.log("seessions: " + length);
    });
  */
  }


  public bookingCardClicked(booking: Booking): void {

    console.log("card Clicked -->(" + booking.description + ")");
    //TODO: if booking is Livebooking, open live detail view
    // if booking is normal finished booking, make it editable

  }

  public dateChanged(): void {
    this._pickedDateString = this.pickedDate.toString();
    this._loadBookings();
  }


  public add(): void {
    this._navController.push(WorkpackageSelectionComponent);
  }


  public calendarClicked(): void {
    console.log("calendar icon clicked");
  }

}
