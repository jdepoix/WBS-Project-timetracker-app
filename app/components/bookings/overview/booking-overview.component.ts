
import {Component} from '@angular/core';
import {NavController} from "ionic-angular/index";

import {Booking} from "../../../models/booking/booking";
import {BookingService} from "../../../services/bookings/booking.service";
import {SessionService} from "../../../services/session/session.service";
import {CreateBookingComponent} from "../create/create-booking.component";




@Component({
  templateUrl: 'build/components/bookings/overview/booking-overview.component.html'
})
export class BookingOverviewComponent {

  private _bookings: Array<Booking>;
  public pickedDate: Date;
  //pickedDateString: String;

  //@ViewChild('picker')picker: ElementRef;
  /*@HostListener("input", ["$event.target.value"])
  onClick() {
    console.log("hghgfh");
  }
*/

  constructor( private _bookingService: BookingService,
               private _navController: NavController,
               private _sessionService: SessionService) {

      //this.pickedDateString = new Date().toDateString();
      this.pickedDate = new Date();


      console.log("begin: " + this.pickedDate);

      this._loadBookings();
      this._sessionService.onProjectSelected.subscribe(() => this._loadBookings());

  }



  private _loadBookings(): void {
    this._bookingService.get(new Date(this.pickedDate.toString()), null).subscribe((bookings: Array<Booking>) => {
      this._bookings = bookings;
    });
  }


  public openBookingDetailComponent(booking: Booking): void {
    console.log("BookingDetailComponent muss noch erstellt werden");
    console.log(this.pickedDate);

    this._navController.push(CreateBookingComponent, {
      booking: booking
    });

  }

  public dateChanged(): void {


    console.log(this.pickedDate);
    //this._pickedDate = new Date.parse(this.pickedDateString);

    this._loadBookings();
    for(var i = 0; i < this._bookings.length; i++){
      console.log(this._bookings[i].description);
    }

  }


}
