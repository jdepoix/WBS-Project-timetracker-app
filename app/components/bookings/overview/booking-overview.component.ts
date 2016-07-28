
import {Component} from '@angular/core';
import {NavController} from "ionic-angular/index";

import {Booking} from "../../../models/booking/booking";
import {BookingComponent} from "../../../components/bookings/booking/booking.component";
import {BookingService} from "../../../services/bookings/booking.service";
import {SessionService} from "../../../services/session/session.service";
import {CreateBookingComponent} from "../create/create-booking.component";
import {WorkpackageSelectionComponent} from "../workpackage-selection/booking-workpackage-selection.component";




@Component({
  templateUrl: 'build/components/bookings/overview/booking-overview.component.html',
  directives: [BookingComponent]
})
export class BookingOverviewComponent {

  private _bookings: Array<Booking>;
  public pickedDate: Date;




  constructor( private _bookingService: BookingService,
               private _navController: NavController,
               private _sessionService: SessionService
   ) {

      this.pickedDate = new Date();
      this._loadBookings();
      this._sessionService.onProjectSelected.subscribe(() => this._loadBookings());

  }



  private _loadBookings(): void {
    this._bookingService.get(new Date(this.pickedDate.toString()), null).subscribe((bookings: Array<Booking>) => {
      this._bookings = bookings;
    });
  }


  public bookingCardClicked(booking: Booking): void {

    console.log("card Clicked -->(" + booking.description + ")");
    //TODO: if booking is Livebooking, open live detail view
    // if booking is normal finished booking, make it editable

  }

  public dateChanged(): void {
    this._loadBookings();
  }


  public add(): void {
    this._navController.push(WorkpackageSelectionComponent);
  }


}
